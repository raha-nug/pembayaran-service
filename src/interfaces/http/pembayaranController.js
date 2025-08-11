import * as appService from "../../application/pembayaranApplicationService.js";

// Controller internal untuk membuat tagihan
export const handleCreateTagihan = async (req, res) => {
  try {
    const tagihan = await appService.createTagihanUseCase(req.body);
    res
      .status(201)
      .json({ message: "Tagihan berhasil dibuat.", data: tagihan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller untuk B1 & B3 (Lihat Tagihan)
export const getTagihan = async (req, res) => {
  try {
    const tagihan = await appService.getTagihanUseCase(
      req.params.pendaftaranId
    );
    if (tagihan.calonMahasiswaId !== req.user.id)
      return res.status(403).json({
        message: "Tidak mempunyai hak",
      });

    res
      .status(200)
      .json({ message: "Berhasil mengambil tagihan", data: tagihan });
  } catch (error) {
    res.status(404).json({ message: "Tagihan tidak ditemukan." });
  }
};

// Controller untuk B2 (Upload Bukti)
export const uploadBukti = async (req, res) => {
  try {
    if (!req.file) throw new Error("File bukti pembayaran harus diunggah.");
    const tagihan = await appService.uploadBuktiBayarUseCase({
      pendaftaranId: req.params.pendaftaranId,
      userId: req.user.id,
      urlBuktiBayar: req.uploadedFileUrl,
    });
    res
      .status(200)
      .json({ message: "Bukti pembayaran berhasil diunggah.", data: tagihan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller untuk A7 (Konfirmasi oleh Admin)
export const konfirmasiPembayaran = async (req, res) => {
  try {
    const tagihan = await appService.adminKonfirmasiPembayaranUseCase({
      pendaftaranId: req.params.pendaftaranId,
      adminId: req.user.id,
    });
    res
      .status(200)
      .json({ message: "Pembayaran berhasil dikonfirmasi.", data: tagihan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Controller untuk A7 (Konfirmasi oleh Admin)
export const getAllTagihan = async (req, res) => {
  try {
    const tagihan = await appService.getAllTagihanUseCase({});
    res
      .status(200)
      .json({ message: "Pembayaran berhasil didapatkan.", data: tagihan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
