import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Fab,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CloseIcon from "@mui/icons-material/Close";
import * as DOMPurify from "dompurify";

import { ApiPostCb } from "api/api";

const Feedback = (props) => {
  const [showText, setShowText] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const onSubmit = () => {
    let text = DOMPurify.sanitize(feedback);
    setSubmitting(true);
    const body = { text };
    ApiPostCb("/api/feedback", body, (res) => {
      setSubmitting(false);
      setShowText(false);
      setFeedback("");
    });
  };

  return (
    <Box sx={{ position: "fixed", bottom: "20px", right: "20px" }}>
      {!showText && (
        <Fab color="primary" aria-label="add" onClick={() => setShowText(true)}>
          <AddCommentIcon />
        </Fab>
      )}
      {showText && (
        <Box
          sx={{
            // width: "300px",
            // height: "300px",
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            border: "3px solid",
            borderColor: "primary.main",
            borderRadius: "7px",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <CloseIcon sx={{ color: "white" }} />
            <Typography> Any Feedback for SBMT?</Typography>
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setShowText(false)}
            />
          </Box>
          <TextField
            sx={{ width: "100%", padding: 2 }}
            multiline={true}
            minRows={8}
            value={feedback}
            autoFocus={true}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onSubmit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setShowText(false);
              }
            }}
          />
          <Button
            sx={{ width: "80%", marginBottom: "8px" }}
            onClick={() => onSubmit()}
            disabled={!feedback}
          >
            {submitting ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

Feedback.propTypes = {
  prop: PropTypes.object,
};

export default Feedback;
