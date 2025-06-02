import React, { useEffect ,useState} from 'react';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Navbar from '../../components/Navbar/layout';
import { User, Book, Users, Settings, Camera } from 'lucide-react';
import '../../styles/profile.css'

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch user data');

        const data = await res.json();
        setUser({
          ...data.user,
          favoriteGenres: data.user.favoriteGenres || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // ✅ Move this ABOVE JSX
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('bio', user.bio);

    try {
      const res = await fetch('/api/user/me', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else {
        console.error('Avatar update failed:', data.message);
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
        }),
      });

      const data = await res.json();
      if (data.success) setUser(data.user);
      else console.error('Update failed:', data.message);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile: {error}</div>;
  if (!user) return null;


  return (
    <div className="profile-container">
      <Navbar
        isAuthenticated={true}
        user={{ name: user.name, email: user.email }}
      />

      <div className="profile-content">
        <div className="profile-wrapper">
          <div className="profile-header">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">
              Manage your reading journey and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="profile-tabs">
            <TabsList className="profile-tabs-list">
              <TabsTrigger className="profile-EachTab" value="profile">
                Profile
              </TabsTrigger>
              <TabsTrigger className="profile-EachTab" value="books">
                My Books
              </TabsTrigger>
              <TabsTrigger className="profile-EachTab" value="clubs">
                My Clubs
              </TabsTrigger>
              <TabsTrigger className="profile-EachTab" value="settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="profile-content-area">
              <Card className="profile-card">
                <CardHeader>
                  <div className="profile-card-header">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                      className="profile-edit-btn"
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="profile-content-area">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar-container">
                      <div className="profile-avatar">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Avatar"
                              className="w-24 h-24 rounded-full object-cover"

                          />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>

                      {isEditing && (
                        <>
                          <label
                            htmlFor="avatar-upload"
                            className="profile-avatar-edit cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                          </label>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>

                    <div className="profile-user-info">
                      <h3 className="profile-user-name">{user.name}</h3>
                      <p className="profile-user-email">{user.email}</p>
                      <div className="profile-user-stats">
                        <span>{user.booksRead} books read</span>
                        <span>•</span>
                        <span>{user.clubsJoined} clubs joined</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-form-grid">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                        disabled={!isEditing}
                        className="profile-form-field mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                        disabled={!isEditing}
                        className="profile-form-field mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={user.bio}
                      onChange={(e) =>
                        setUser({ ...user, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      className="profile-bio-field"
                      rows={3}
                    />
                  </div>

                  <div className="profile-genres-section">
                    <Label>Favorite Genres</Label>
                    <div className="profile-genres-list">
                      {(user.favoriteGenres ?? []).map((genre, index) => (
                        <span key={index} className="profile-genre-tag">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="profile-stats-grid">
                <Card>
                  <CardContent className="profile-stat-card">
                    <Book className="profile-stat-icon" />
                    <div className="profile-stat-number">{user.booksRead}</div>
                    <div className="profile-stat-label">Books Read</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="profile-stat-card">
                    <Users className="profile-stat-icon" />
                    <div className="profile-stat-number">
                      {user.clubsJoined}
                    </div>
                    <div className="profile-stat-label">Clubs Joined</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="profile-stat-card">
                    <Settings className="profile-stat-icon" />
                    <div className="profile-stat-number">
                      {user.discussionsStarted}
                    </div>
                    <div className="profile-stat-label">
                      Discussions Started
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="books">
              <Card>
                <CardHeader>
                  <CardTitle>My Reading List</CardTitle>
                  <CardDescription>
                    Books you've read and want to read
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="profile-empty-state">
                    <Book className="profile-empty-icon" />
                    <p>Your reading list will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clubs">
              <Card>
                <CardHeader>
                  <CardTitle>My Book Clubs</CardTitle>
                  <CardDescription>
                    Clubs you've joined or created
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="profile-empty-state">
                    <Users className="profile-empty-icon" />
                    <p>Your book clubs will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="profile-settings-list">
                    <div className="profile-setting-item">
                      <div className="profile-setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive updates about your clubs and discussions</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="profile-setting-btn"
                      >
                        Configure
                      </Button>
                    </div>
                    <div className="profile-setting-item">
                      <div className="profile-setting-info">
                        <h4>Privacy Settings</h4>
                        <p>Control who can see your profile and activity</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="profile-setting-btn"
                      >
                        Manage
                      </Button>
                    </div>
                    <div className="profile-setting-item">
                      <div className="profile-setting-info">
                        <h4>Change Password</h4>
                        <p>Update your account password</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="profile-setting-btn"
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
