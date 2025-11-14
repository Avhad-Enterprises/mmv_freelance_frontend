import Image from "next/image";

type Props = {
  profile_picture?: string;
};

const CandidateProfileImage = ({ profile_picture }: Props) => {
  const imageSrc = profile_picture || "/assets/images/default-profile.jpg";

  return (
    <div className="candidate-img">
      <Image
        src={imageSrc}
        alt="Candidate Profile"
        width={100}
        height={100}
      />
    </div>
  );
};

export default CandidateProfileImage;
