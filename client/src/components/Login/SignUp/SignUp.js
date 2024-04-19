import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Background from "../../../assets/images/bg2.jpg";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import register from "../../../services/registerService";
import { useNavigate } from "react-router";
import { isValidEmail } from "../../../util/utils";
import { useAlert } from "../../../context/AlertContext";
import AutoComplete from "../../AutoComplete/AutoComplete";
import citiesList from "../../../assets/images/citiesList";
const defaultTheme = createTheme();

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function SignUp() {
  let navigate = useNavigate();
  const [image, setImage] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const alert = useAlert();

  const validateEmail = (email) => {
    if (!isValidEmail(email)) {
      alert.showAlert("Invalid email address", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      username: data.get("email"),
      password: data.get("password"),
      firstname: data.get("firstName"),
      lastname: data.get("lastName"),
      location: location,
    };

    if (image) {
      payload.profilePic = image;
    }

    const fiedlsMissing =
      !payload.firstname ||
      !payload.lastname ||
      !payload.username ||
      !payload.password;

    if (fiedlsMissing) {
      alert.showAlert("Make sure you fill all the required fields!", "error");
      return;
    }

    if (!validateEmail(payload.username)) return;

    const response = await register(payload);
    switch (response.status) {
      case 200:
        alert.showAlert("User registered successfully", "success");
        navigate("/login");
        break;
      case 400:
        alert.showAlert("User already exists", "error");
        break;
      default:
        alert.showAlert("Failed to register user", "error");
    }
  };

  const handleFileInputChange = () => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // if image size is greater than 2mb then return
        if (reader.result.length > 1048576 * 2) {
          alert.showAlert("Image size should be less than 1MB", "error");
          return;
        }
        setImage(reader.result);
        alert.showAlert("Image uploaded successfully", "success");
      };
      reader.readAsDataURL(file);
    } else {
      alert.showAlert("Failed to upload image", "error");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Background})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} src={image}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                {/* Location */}
                <Grid item xs={12}>
                  <AutoComplete
                    options={citiesList}
                    value={location}
                    setValue={(value) => setLocation(value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<AccountCircle />}
                  >
                    Upload Profile Picture
                    <VisuallyHiddenInput
                      id="profilePic"
                      name="profilePic"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                    />
                  </Button>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
