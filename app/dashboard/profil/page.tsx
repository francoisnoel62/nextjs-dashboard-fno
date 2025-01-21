import { auth } from '@/auth';
import ProfileForm from '@/app/ui/profil/profil-form';
import { fetchProfileByUserId } from '@/app/lib/data';

export default async function ProfilePage() {
  const session = await auth();
  let profileData = null;

  if (session?.user?.id) {
    const data = await fetchProfileByUserId(session.user.id);
    if (data) {
      profileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        telephone: data.telephone,
        date_of_birth: data.date_of_birth,
      };
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile Settings</h1>
      <ProfileForm initialData={profileData} />
    </div>
  );
}
