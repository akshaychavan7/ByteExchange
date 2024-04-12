import { useState, useEffect } from "react";
import "./TagPage.css";
import Tag from "./tag/Tag";
import { Grid, TextField } from "@mui/material";
import AskAQuestionButton from "../AskAQuestionButton/AskAQuestionButton";

const TagPage = ({
  getTagsWithQuestionNumber,
  clickTag,
  handleNewQuestion,
}) => {
  const [tlist, setTlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    getTagsWithQuestionNumber().then((res) => {
      setTlist(res);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTagsList = tlist.filter((tag) => {
    return tag.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="space_between right_padding">
        <div className="bold_title">{tlist.length} Tags</div>
        <div className="bold_title">All Tags</div>
        <AskAQuestionButton handleNewQuestion={handleNewQuestion} />
      </div>
      <TextField
        label="Search Tag"
        size="small"
        autoFocus={true}
        className="search-user"
        color="primary"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Grid
        container
        direction="row"
        columnSpacing={3}
        rowSpacing={2}
        sx={{ padding: "30px" }}
      >
        {filteredTagsList.map((t, idx) => (
          <Tag key={idx} t={t} clickTag={clickTag} />
        ))}
      </Grid>
    </>
  );
};

export default TagPage;
