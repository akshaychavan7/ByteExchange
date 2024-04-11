import { Stack } from "@mui/material";
import ProfileAvatar from "../Avatar/AltAvatar";

export default function AuthorMeta({ name, profilePic }) {
  return (
    <Stack direction="row" spacing={1}>
      <ProfileAvatar name={name} image={profilePic} width={30} height={30} />
      <div className="question_author">{name}</div>
    </Stack>
  );
}
