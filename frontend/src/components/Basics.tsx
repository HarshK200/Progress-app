import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  location: Location;
  profiles: Profile[];
}

interface Location {
  address: string;
  postalCode: string;
}

interface Profile {
  id: number;
  name: string;
  username: string;
}

export const BasicsComp = () => {
  const [basics, setBasics] = useState<Basics>({
    name: "",
    label: "",
    image: "",
    email: "",
    location: { address: "", postalCode: "" },
    profiles: [],
  });

  useEffect(() => {
    console.log(basics);
  }, [basics]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.placeholder === "name" || "label" || "image" || "email") {
      handleFirstLevelChange(e.target.placeholder, e.target.value);
    }
    if (e.target.placeholder === "address" || "postalCode") {
      handleUpdateLocation(e);
    }
  }

  // NOTE: handle name, label, image, email
  function handleFirstLevelChange(keyString: string, value: string) {
    const key = keyString as keyof Basics;
    setBasics((prev) => ({ ...prev, [key]: value }));
  }

  // NOTE: handle location
  function handleUpdateLocation(e: React.ChangeEvent<HTMLInputElement>) {
    const key = e.target.placeholder;
    const val = e.target.value;

    const newLocation: Location = {
      address: key === "address" ? val : basics.location.address,
      postalCode: key === "postalCode" ? val : basics.location.postalCode,
    };

    setBasics((prev) => {
      return {
        ...prev,
        location: newLocation,
      };
    });
  }

  return (
    <div className="flex flex-col bg-background-secondary rounded-md w-[400px] mx-auto p-4">
      {/* Level-One basics */}
      <h1>Basics</h1>
      <input placeholder="name" value={basics.name} onChange={handleOnChange} />
      <input
        placeholder="label"
        value={basics.label}
        onChange={handleOnChange}
      />
      <input
        placeholder="image"
        value={basics.image}
        onChange={handleOnChange}
      />
      <input
        placeholder="email"
        value={basics.email}
        onChange={handleOnChange}
      />

      {/* Location */}
      <div className="">
        <h1>Location</h1>
        <input
          placeholder="address"
          value={basics.location.address}
          onChange={handleOnChange}
        />
        <input
          placeholder="postalCode"
          value={basics.location.postalCode}
          onChange={handleOnChange}
        />
      </div>

      {/* Profile array maps */}
      <div className="flex flex-col w-[100px] mt-4">
        <h1 className="text-xl font-bold">Profiles</h1>
        {basics.profiles.map((profile) => {
          return (
            <Profile key={profile.id} data={profile} setData={setBasics} />
          );
        })}
      </div>

      {/* Add new profile */}
      <AddProfile setData={setBasics} />
    </div>
  );
};

// TODO: COMPLEX
const Profile = ({
  data,
  setData,
}: {
  data: Profile;
  setData: React.Dispatch<React.SetStateAction<Basics>>;
}) => {
  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData((prev) => {
      const key = e.target.placeholder;
      const val = e.target.value;

      const newProfiles = prev.profiles.map((profile) => {
        if (profile.id == data.id) {
          return {
            id: data.id,
            name: key === "name" ? val : data.name,
            username: key === "username" ? val : data.username,
          };
        }
        return profile;
      });

      return { ...prev, profiles: newProfiles };
    });
  }

  return (
    <div className="flex flex-col">
      <input
        placeholder="name"
        value={data.name}
        onChange={handleProfileChange}
      />
      <input
        placeholder="username"
        value={data.username}
        onChange={handleProfileChange}
      />
    </div>
  );
};

const AddProfile = ({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<Basics>>;
}) => {
  const [addData, setAddData] = useState<Profile>({
    id: Math.random() * 1000,
    name: "",
    username: "",
  });

  function handleAddProfile() {
    if (addData.name === "" || addData.username === "") {
      console.log("Empty profile data cannot insert");
      return;
    }

    setData((prev) => {
      return { ...prev, profiles: [...prev.profiles, addData] };
    });
  }

  return (
    <div className="mt-4">
      <h1 className="text-xl font-bold">Add New Profile</h1>
      <input
        className="bg-gray-300 placeholder:text-black text-black"
        placeholder="name"
        value={addData.name}
        onChange={(e) => {
          setAddData((prev) => ({ ...prev, name: e.target.value }));
        }}
      />
      <input
        className="bg-gray-300 placeholder:text-black text-black"
        placeholder="username"
        value={addData.username}
        onChange={(e) => {
          setAddData((prev) => ({ ...prev, username: e.target.value }));
        }}
      />
      <button className="flex" onClick={handleAddProfile}>
        Add <Plus />
      </button>
    </div>
  );
};
