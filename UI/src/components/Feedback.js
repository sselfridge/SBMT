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
  const [submitting, setSubmitting] = useState("un-submitted");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const emailRef = React.useRef();

  const onSubmit = () => {
    const preText = `${feedback} -- ${email}`;
    let text = DOMPurify.sanitize(preText);
    setSubmitting("submitting");
    const body = { text };
    ApiPostCb("/api/feedback", body, (res) => {
      setTimeout(() => {
        setSubmitting("submitted");
        setTimeout(() => {
          setSubmitting("un-submitted");
          setFeedback("");
          setShowText(false);
        }, 1000);
      }, 1000);
    });
  };

  const submitDisabled = !feedback || submitting !== "un-submitted";

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
            gap: 2,
            p: 2,
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
            sx={{ width: "100%" }}
            multiline={true}
            minRows={8}
            value={feedback}
            autoFocus={true}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                emailRef.current.focus();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setShowText(false);
              }
            }}
          />
          <TextField
            sx={{ width: "100%" }}
            label="Email"
            value={email}
            inputProps={{ ref: emailRef }}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.ctrlKey || e.metaKey) &&
                !submitDisabled
              ) {
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
            disabled={submitDisabled}
          >
            {submitting === "submitting" ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : submitting === "un-submitted" ? (
              "Submit"
            ) : (
              "Submitted!"
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
