'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
 
  LinkedinIcon as LinkedIn,
  ChevronRight,
  Edit,
  Save,
  X,

  PhoneCallIcon
} from 'lucide-react';
import StatisticsCard from '../components/dashboardComp/StatisticsCard';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  login: string;
  location?: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
  html_url?: string; // Add this line
}




const UserDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Record<string, string | null>>({});


  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
 

  // Fetch or create user profile
  useEffect(() => {
    const fetchOrCreateUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
  
          if (error && error.code === 'PGRST116') {
            const { error: insertError } = await supabase.from('profiles').insert({
              id: user.id,
              name: user.user_metadata.name || 'Anonymous',
              email: user.email,
              avatar_url: user.user_metadata.avatar_url || null,
            });
  
            if (insertError) {
              console.error('Error inserting new user profile:', insertError);
              setLoading(false);
              return;
            }
  
            setUserProfile({
              ...user.user_metadata,
              id: user.id,
              name: user.user_metadata.name || 'Anonymous',
              email: user.email,
              avatar_url: user.user_metadata.avatar_url || null,
            });
          } else if (data) {
            setUserProfile({
              ...user.user_metadata,
              ...data,
            });
          }
        } catch (err) {
          console.error('Unexpected error fetching or creating user profile:', err);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchOrCreateUserProfile();
  }, [user]);

  // Handle input changes during editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    if (!user || !userProfile) return;  // Ensure userProfile is not null
  
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editedProfile.name ?? userProfile.name,
          location: editedProfile.location ?? userProfile.location,
          company: editedProfile.company ?? userProfile.company,
          twitter_username: editedProfile.twitter_username ?? userProfile.twitter_username,
        })
        .eq('id', user.id);
  
      if (error) {
        console.error('Error updating profile:', error);
        return;
      }
  
      // Update local state
      setUserProfile((prev) => ({
        ...prev!,
        ...editedProfile
      }));
  
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error('Unexpected error saving profile:', err);
    }
  };
  

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedProfile({});
    setIsEditing(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-darkBackground ">
        <div className="w-16 h-16 border-4 border-primary dark:border-neutral-100 dark:border-t-transparent  border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // No user profile
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-200 dark:bg-darkBackground p-6 ">
      <div className="max-w-6xl mx-auto space-y-6 mt-10">
      <div className="bg-neutral-400 dark:bg-darkBox rounded-xl shadow-lg overflow-hidden">
      <div className="p-3 xs:p-4 sm:p-6 dark:bg-darkBox dark:text-white text-neutral-900 relative">
        {/* Edit and My Blogs Buttons */}
        <div className="absolute top-4 right-4 xs:top-4 xs:right-4 flex space-x-1 xs:space-x-2 lg:gap-2 md:gap-2 ">
          {!isEditing ? (
            <>
              <button
                onClick={() => {
                  setEditedProfile({...userProfile});
                  setIsEditing(true);
                }}
                className="bg-white/20 rounded-full p-2 xs:p-3 hover:bg-white/30 transition"
              >
                <Edit className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => router.push('/userblog')}
                className="bg-blue-500/20 rounded-md p-2 xs:p-3  hover:bg-blue-500/30 transition text-xs xs:text-sm"
              >
                My Blogs
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveProfile}
                className="bg-green-500/20 rounded-full p-1 xs:p-2 hover:bg-green-500/30 transition"
              >
                <Save className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-red-500/20 rounded-full p-1 xs:p-2 hover:bg-red-500/30 transition"
              >
                <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Profile Content */}
        <div className="flex flex-col xs:flex-row items-center space-y-2 xs:space-y-0 xs:space-x-4 sm:space-x-6">
          {/* Avatar */}
          <img
            src={userProfile.avatar_url || '/default-avatar.png'}
            alt="User Avatar"
            className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 object-cover"
          />

          {/* User Info */}
          <div className="text-center xs:text-left w-full">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 xs:mb-2">
              {!isEditing ? (
                userProfile?.name || 'User'
              ) : (
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name || ''}
                  onChange={handleInputChange}
                  className="bg-white/20 dark:text-white text-neutral-800 px-2 py-1 rounded w-full text-center xs:text-left text-base xs:text-lg"
                  placeholder="Enter your name"
                />
              )}
            </h1>
            <p className="text-sm xs:text-base opacity-80">{userProfile.email}</p>
          </div>
        </div>
      </div>
    </div>
        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Details Card */}
          <div className=" dark:bg-darkBox bg-neutral-400 rounded-xl shadow-lg p-6 md:col-span-2">
            <div className="flex items-center mb-6 border-b pb-4">
              <User className="w-6 h-6 mr-3 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800  dark:text-neutral-200">Profile Details</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 ">
              {[
                { 
                  icon: PhoneCallIcon, 
                  label: 'Phone number', 
                  name: 'Phone number',
                  value: userProfile.login 
                },
                { 
                  icon: MapPin, 
                  label: 'Location', 
                  name: 'location',
                  value: userProfile.location 
                },
                { 
                  icon: Briefcase, 
                  label: 'Company', 
                  name: 'company',
                  value: userProfile.company 
                },
                { 
                  icon: LinkIcon, 
                  label: 'Website', 
                  name: 'blog',
                  value: userProfile.blog 
                }
              ].map((detail, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-neutral-300 text-gray-600 dark:text-white dark:bg-neutral-900  p-3 rounded-lg"
                >
                  <detail.icon className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" />
                  <div className="flex-1">
                    <p className="text-[1rem] text-gray-700 dark:text-neutral-100 ">{detail.label}</p>
                    {!isEditing ? (
                      <p className="font-medium ">{detail.value || 'Not specified'}</p>
                    ) : (
                      <input 
                        type="text"
                        name={detail.name}
                        value={editedProfile[detail.name] || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 rounded border bg-gray-100 dark:text-white text-gray-600 dark:bg-neutral-800 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Enter ${detail.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links Card */}
          <div className="dark:bg-darkBox bg-neutral-400 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6 border-b pb-4">
              <LinkIcon className="w-6 h-6 mr-3 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Social Links</h2>
            </div>
            <div className="space-y-4">
              {[
                { 
                  icon: Twitter, 
                  label: 'Twitter', 
                  name: 'twitter_username',
                  value: userProfile.twitter_username,
                  link: `https://twitter.com/${userProfile.twitter_username}`
                },
                { 
                  icon:LinkedIn, 
                  label: 'LinkedIn', 
                  name: 'login',
                  value: userProfile.login,
                  link: userProfile.html_url
                }
              ].map((social, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-neutral-300 dark:text-white text-gray-700 dark:bg-neutral-900 p-3 rounded-lg"
                >
                  <div className="flex items-center flex-1">
                    <social.icon className="w-5 h-5 mr-3 text-purple-600" />
                    <span className="font-medium mr-2 dark:text-white text-gray-500">{social.label}</span>
                  </div>
                  {!isEditing ? (
                    social.value && (
                      <a 
                        href={social.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-purple-600 transition"
                      >
                        <span className="mr-2">{social.value}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </a>
                    )
                  ) : (
                    <input 
                      type="text"
                      name={social.name}
                      value={editedProfile[social.name] || ''}
                      onChange={handleInputChange}
                      className="px-2 py-1 rounded border bg-gray-100 dark:text-white text-gray-600 dark:bg-neutral-800 border-gray-200 dark:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                      placeholder={`Enter ${social.label} username`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Cards */}
          <StatisticsCard/>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;