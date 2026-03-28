import { useState } from "react";

const LawyerProfile = () => {
    // Dummy lawyer data (replace with API later)
    const [profile, setProfile] = useState({
        name: "John Doe",
        specialization: "Criminal Law",
        experience: "5 Years",
        email: "john@example.com",
        location: "Chennai",
        phone: "+91 9876543210",
        bio: "Experienced lawyer handling criminal and civil cases with a strong track record.",
        casesHandled: 45,
        rating: 4.5
    });

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="bg-white shadow-lg rounded-xl p-6 border">

                <h1 className="text-2xl font-bold mb-6">Lawyer Profile</h1>

                <div className="space-y-3 text-gray-700">

                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Specialization:</strong> {profile.specialization}</p>
                    <p><strong>Experience:</strong> {profile.experience}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Location:</strong> {profile.location}</p>
                    <p><strong>Cases Handled:</strong> {profile.casesHandled}</p>
                    <p><strong>Rating:</strong> ⭐ {profile.rating}</p>

                    <div>
                        <p className="font-semibold">Bio:</p>
                        <p>{profile.bio}</p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default LawyerProfile;