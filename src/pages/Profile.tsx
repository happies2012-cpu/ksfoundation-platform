import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { userApi } from '@/lib/api';
import { User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      bio: user?.bio || '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('full_name', user.full_name || '');
      setValue('bio', user.bio || '');
      setAvatarUrl(user.avatar_url);
    }
  }, [user, setValue]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const avatarUrl = await userApi.uploadAvatar(file, user?.id as string);
      
      // Update user profile with avatar URL
      await userApi.updateUserProfile(user?.id as string, { avatar_url: avatarUrl });
      
      setAvatarUrl(avatarUrl);
      await refreshUser();
      
      toast({
        title: 'Success',
        description: 'Avatar updated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to upload avatar.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await userApi.updateUserProfile(user?.id as string, {
        full_name: data.full_name,
        bio: data.bio,
      });
      
      await refreshUser();
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black mb-8">
            <span className="gradient-text-orange">Profile</span>
          </h1>
          
          <Card className="glass-card p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile avatar" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                      aria-describedby="avatar-description"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
                      <User className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0">
                    <label 
                      htmlFor="avatar-upload" 
                      className="cursor-pointer"
                      aria-label="Upload new avatar"
                    >
                      <div className="bg-primary rounded-full p-2 shadow-lg">
                        <User className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
                      </div>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={uploadAvatar}
                      className="hidden"
                      disabled={uploading}
                      aria-label="Avatar upload input"
                    />
                  </div>
                </div>
                <p id="avatar-description" className="sr-only">Current profile avatar</p>
                {uploading && (
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                )}
              </div>
              
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  placeholder="Your full name"
                  aria-invalid={!!errors.full_name}
                  aria-describedby={errors.full_name ? "full-name-error" : undefined}
                />
                {errors.full_name && (
                  <p id="full-name-error" className="text-sm text-destructive">{errors.full_name.message}</p>
                )}
              </div>
              
              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  aria-invalid={!!errors.bio}
                  aria-describedby={errors.bio ? "bio-error" : undefined}
                />
                {errors.bio && (
                  <p id="bio-error" className="text-sm text-destructive">{errors.bio.message}</p>
                )}
              </div>
              
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="bg-muted"
                  aria-readonly="true"
                />
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="rocket" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;