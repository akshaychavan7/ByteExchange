import { Box, Typography } from "@mui/material";

export default function List({ list, title = "Questions", type = "question" }) {
  return (
    <>
      <Typography variant="h6">{title}</Typography>
      {list.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 5 }}>
          No {title.toLowerCase()} posted yet
        </Typography>
      ) : (
        <Box
          sx={{
            border: "1px solid lightgray",
            borderRadius: "5px",
            marginTop: "15px",
          }}
        >
          {list?.map((item, idx) => (
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              key={idx}
              className="list-item"
            >
              <Typography variant="body1" className="vote-count-box">
                {item?.vote_count}
              </Typography>
              <Typography variant="body1" className="list-text txt">
                {type === "question" ? item.title : item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
