package com.revature.utils;

import com.nimbusds.jose.EncryptionMethod;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWEHeader;
import com.nimbusds.jose.crypto.RSADecrypter;
import com.nimbusds.jose.crypto.RSAEncrypter;
import com.nimbusds.jwt.EncryptedJWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.revature.dtos.ProfileDTO;
import com.revature.models.Profile;
import lombok.extern.log4j.Log4j2;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.sql.Timestamp;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Log4j2
public class SecurityUtil {
    /*
    Auth Constants
     */
    private static final int SALT_LENGTH = 512;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 512;
    private static final String ALGORITHM = "PBKDF2WithHmacSHA512";
    public static final String USER_PROFILE = "user-profile";
    public static final String PROFILE_IDENTITY_TOKEN = "profile-identity-token";
    public static final String RSA = "RSA";
    private static RSAEncrypter encrypter;
    private static RSADecrypter decrypter;

    /*
    Profile Constants
     */
    public static final String PID = "pid";
    public static final String PROFILE = "profile";
    public static final String USERNAME = "username";
    public static final String PASSWORD = "password";
    public static final String FIRST_NAME = "firstName";
    public static final String LAST_NAME = "lastName";
    public static final String BIO = "bio";
    public static final String VERIFICATION = "verification";


    private SecurityUtil() {
        super();
    }

    /**
     * Generates a string used to hash passwords
     * @return a base 64 encoded string
     */
    private static String generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        SECURE_RANDOM.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    /**
     * Uses the given salt to hash the password
     * @param password string to hash
     * @param salt string to hash the password with
     * @return the hashed string
     */
    private static String hashPassword(String password, String salt) {
        char[] chars = password.toCharArray();
        byte[] bytes = salt.getBytes();
        PBEKeySpec spec = new PBEKeySpec(chars, bytes, ITERATIONS, KEY_LENGTH);
        Arrays.fill(chars, Character.MIN_VALUE);

        try {
            SecretKeyFactory fac = SecretKeyFactory.getInstance(ALGORITHM);
            byte[] securePassword = fac.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(securePassword);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            log.error(e.getMessage());
        } finally {
            spec.clearPassword();
        }
        
        // is this return null the reason why ?
        return null;
    }

    /**
     * Hashes the given password to create a passkey
     * @param password the string to hash
     * @return the hashed password string
     */
    public static String hashPassword(String password) {
        if (password == null) {
            log.error("Cannot hash null values. Exiting method and returning null.");
            return null;
        }
        if (password.isEmpty()) {
            log.error("Cannot hash an empty string. Exiting method and returning null.");
            return null;
        }
        String salt = generateSalt();
        String hashed = hashPassword(password, salt);
        return hashed + salt;
    }

    /**
     * Determines is the password given is the one associated with the given pass key
     * @param password the password to test for validity
     * @param passKey the passkey to check the password against
     * @return true if password is correct
     */
    public static boolean isPassword(String password, String passKey) {
        if (password == null || passKey == null) {
            log.error("Cannot verify null password or pass key. Exiting method and returning false.");
            return false;
        }
        if (password.isEmpty() || passKey.isEmpty()) {
            log.error("Cannot verify empty password or pass key. Exiting method and returning false.");
            return false;
        }
        if (passKey.length() < 88) return false;
        String encrypted = hashPassword(password, passKey.substring(88));
        if (encrypted == null) {
            log.error("Unable to verify password validity. Exiting method and returning false.");
            return false;
        }
        return encrypted.equals(passKey.substring(0,88));
    }

    /**
     * Generates a unique random id
     * @return the id
     */
    public static Long getId() {
        UUID id = UUID.randomUUID();
        int uid = (""+id).hashCode();
        String filterStr = "" + uid;
        String str = filterStr.replace("-", "");
        return (long) Integer.parseInt(str);
    }

    /**
     * Generates the encryption and decryption objects used to encrypt/decrypt tokens
     */
    private static void generateEncryptionObjects() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA);
            //Initialize key size
            keyPairGenerator.initialize(2048);
            // Generate the key pair
            KeyPair keyPair = keyPairGenerator.genKeyPair();

            // Create KeyFactory and RSA Keys Specs
            KeyFactory keyFactory = KeyFactory.getInstance(RSA);
            RSAPublicKeySpec publicKeySpec = keyFactory.getKeySpec(keyPair.getPublic(), RSAPublicKeySpec.class);
            RSAPrivateKeySpec privateKeySpec = keyFactory.getKeySpec(keyPair.getPrivate(), RSAPrivateKeySpec.class);

            // Generate (and retrieve) RSA Keys from the KeyFactory using Keys Specs
            RSAPublicKey publicRsaKey = (RSAPublicKey) keyFactory.generatePublic(publicKeySpec);
            RSAPrivateKey privateRsaKey = (RSAPrivateKey) keyFactory.generatePrivate(privateKeySpec);

            // Create an RSA encrypted with the specified public RSA key
            encrypter = new RSAEncrypter(publicRsaKey);
            // Create a decrypter with the specified private RSA key
            decrypter = new RSADecrypter(privateRsaKey);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            log.error(e.getMessage());
        }
    }

    /**
     * Generates a string encrypting the given id and additional validation information
     * @param profile the object that is going to be encrypted
     * @return the encrypted token string
     */
    public static String generateToken(ProfileDTO profile) {
        if (profile == null) {
            log.error("Cannot generate token from null values. Exiting method and returning null.");
            return null;
        }

        if (profile.isIncomplete()) {
            log.error("Profile was incomplete.");
            return null;
        }

        if (decrypter == null) {
            generateEncryptionObjects();
        }

        JWTClaimsSet.Builder claimsSet = new JWTClaimsSet.Builder();
        claimsSet.issuer(USER_PROFILE);
        claimsSet.subject(PROFILE_IDENTITY_TOKEN);

        claimsSet.claim(PROFILE, profile);

        claimsSet.expirationTime(Timestamp.valueOf(LocalDateTime.now().plusHours(4)));
        claimsSet.notBeforeTime(Timestamp.valueOf(LocalDateTime.now()));
        claimsSet.jwtID(UUID.randomUUID().toString());

        // Create the JWE header and specify:
        // RSA-OAEP-256 as the encryption algorithm
        // 128-bit AES/GCM as the encryption method
        JWEHeader header = new JWEHeader(JWEAlgorithm.RSA_OAEP_256, EncryptionMethod.A128GCM);
        // Initialized the EncryptedJWT object
        EncryptedJWT jwt = new EncryptedJWT(header, claimsSet.build());

        try {
            jwt.encrypt(encrypter);
        } catch (JOSEException e) {
            log.error("Unable to encrypt token" + e.getMessage());
        }

        return jwt.serialize();
    }

    private static EncryptedJWT decryptToken(EncryptedJWT jwt) {
        try {
            jwt.decrypt(decrypter);
            return jwt;
        } catch (JOSEException e) {
            log.error("Unable to decrypt token " + e.getMessage());
        }
        return null;
    }

    /**
     * Decrypts token, checks for correct data, and returns the profile within
     * @param token string of the encrypted token
     * @return the decrypted profile, null if invalid
     */
    public static Profile validateToken(String token) {
        if (decrypter == null) {
            log.error("Decrypter never initialized!");
            return null;
        }
        if (token == null) {
            log.error("Cannot validate null token. Exiting method and returning null.");
            return null;
        }
        if (token.isEmpty()) {
            log.error("Cannot validate empty token string. Exiting method and returning null.");
            return null;
        }
        try {
            EncryptedJWT jwt = EncryptedJWT.parse(token);

            jwt = decryptToken(jwt);
            if (jwt == null) return null;

            JWTClaimsSet claims = jwt.getJWTClaimsSet();
            if (!claims.getIssuer().equals(USER_PROFILE)) return null;
            if (claims.getExpirationTime().before(Timestamp.valueOf(LocalDateTime.now()))) return null;
            if (Timestamp.valueOf(LocalDateTime.now()).before(claims.getNotBeforeTime())) return null;

            Map<String, Object> guts = claims.getJSONObjectClaim(PROFILE);

            Long id = (Long) guts.get(PID);
            String username = (String) guts.get(USERNAME);
            String password = (String) guts.get(PASSWORD);
            String firstName = (String) guts.get(FIRST_NAME);
            String lastName = (String) guts.get(LAST_NAME);
            String bio = (String) guts.get(BIO);
            boolean verification = (boolean) guts.get(VERIFICATION);

            return new Profile(id, username, password, firstName, lastName, bio, verification);
        } catch (ParseException e) {
            log.error("Unable to parse token " + e.getMessage());
        }
        return null;
    }
}
