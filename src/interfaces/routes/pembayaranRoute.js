import express from "express";
import * as controller from "../http/pembayaranController.js";
import {
  authenticateToken,
  requireAdmin,
} from "../http/middlewares/authenticate.js";
import {
  ftpUploadMiddleware,
  uploadSingleFile,
} from "../http/middlewares/fileUpload.js"; // Asumsi sudah dibuat

const router = express.Router();

// Endpoint internal, dipanggil oleh event handler
router.post(
  "/internal/create-tagihan",
  authenticateToken,
  controller.handleCreateTagihan
);

// Endpoint untuk calon mahasiswa
router.get("/tagihan/:pendaftaranId", authenticateToken, controller.getTagihan); // B1, B3
router.post(
  "/tagihan/:pendaftaranId/upload-bukti",
  authenticateToken,
  uploadSingleFile, // Middleware multer
  ftpUploadMiddleware,
  controller.uploadBukti // B2
);

// Endpoint untuk admin
router.post(
  "/tagihan/:pendaftaranId/konfirmasi",
  authenticateToken,
  requireAdmin,
  controller.konfirmasiPembayaran // A7
);

export default router;
