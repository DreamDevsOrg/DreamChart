import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import React from "react";

const TokenDetailModal = ({ token, open, onClose }) => {
  console.log({ token });
  return (
    <Modal
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      open={open}
      onClose={onClose}
    >
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6">{token?.symbol}</Typography>
      </Box>
    </Modal>
  );
};

export default TokenDetailModal;
