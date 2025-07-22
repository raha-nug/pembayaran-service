import * as appService from "../../application/pembayaranApplicationService.js";

// Controller internal untuk membuat tagihan
export const handleCreateTagihan = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const verifRes = await fetch(
      `${process.env.PENDAFTARAN_SERVICE_URL}/api/verifyPendaftaran/${req.body.pendaftaranId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const pendaftaranVerif = await verifRes.json();
    if (pendaftaranVerif.message !== "Terverifikasi") {
      return res.status(400).json({
        message: "Id pendaftaran tidak valid",
      });
    }

    const response = await fetch(
      `${process.env.PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${req.body.pendaftaranId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const pendaftaran = await response.json();

    const useCaseData = {
      pendaftaranId: req.body.pendaftaranId,
      calonMahasiswaId: pendaftaran.data.calonMahasiswaId,
    };

    const tagihan = await appService.createTagihanUseCase(useCaseData);
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
    const tagihan = await appService.getTagihanUseCase(req.params.pendaftaranId);
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
