import { useEffect, useState } from "react";
import { profileApi } from "../../util/postApi";
import { Profile } from "../../types/profile";
import styles from '../profile/Profile.module.css';

type Props = {
  onSelectUser?: (user: Profile) => void;
};

export default function SearchBar({ onSelectUser }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await profileApi.searchProfiles(query);
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 400); 

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div style={{ width: "100%" }}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />

      {loading && <div>Searching...</div>}

      {results.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {results.map((user) => (
            <div
              key={user.id}
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => onSelectUser?.(user)}
            >
              <strong>{user.username}</strong>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>
                {user.firstName} {user.lastName}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div style={{ marginTop: 8, fontSize: "0.9rem", color: "#888" }}>
          No users found
        </div>
      )}
    </div>
  );
}
