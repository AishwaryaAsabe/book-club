import React, { useEffect, useState } from 'react';
import { X, Crown, Shield } from 'lucide-react';

interface Member {
  _id: string;
  name: string;
  avatar: string;
  status: string;
}

interface ChatMemberListProps {
  onClose: () => void;
  clubId: string;
}

const ChatMemberList: React.FC<ChatMemberListProps> = ({ onClose, clubId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   async function fetchMembers() {
  try {
    const response = await fetch(`/api/clubs/getMembers/${clubId}`);
    console.log("📡 API Response Status:", response.status);

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ API Error:", err);
      throw new Error(err.error || 'Fetch failed');
    }

    const data = await response.json();
    console.log("✅ Fetched Members:", data.members);
    setMembers(data.members || []);
  } catch (error) {
    if (error instanceof Error) {
      console.error("💥 Fetch Error:", error.message);
      setError(error.message || 'Something went wrong');
    } else {
      console.error("💥 Fetch Error:", error);
      setError('Something went wrong');
    }
  } finally {
    setLoading(false);
  }
}


    if (clubId) {
      fetchMembers();
    }
  }, [clubId]);

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="member-list-sidebar">
      <div className="member-list-header">
        <h3 className="member-list-title">Club Members</h3>
        <button onClick={onClose} className="close-member-list">
          <X className="close-icon" />
        </button>
      </div>

      <div className="member-list">
        {members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          members.map((member) => (
            <div key={member._id} className="member-item">
              <div className="member-avatar-wrapper">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="member-avatar"
                />
                <div className={`member-status ${member.status}`}></div>
              </div>
              <div className="member-info">
                <div className="member-name-row">
                  <span className="member-name">{member.name}</span>
                  {/* Add role icons if you want, but you currently don't have role info */}
                </div>
                <span className="member-status-text">{member.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatMemberList;
