export const createTagihan = ({
  pendaftaranId,
  calonMahasiswaId,
  jumlah,
  deskripsi,
}) => {
  if (!pendaftaranId || !calonMahasiswaId || jumlah <= 0) {
    throw new Error("Data untuk pembuatan tagihan tidak valid.");
  }
  return {
    pendaftaranId,
    calonMahasiswaId,
    jumlah,
    deskripsi,
    status: "MENUNGGU_PEMBAYARAN",
  };
};


export const prosesUploadBukti = (tagihan, urlBuktiBayar) => {
  if (tagihan.status !== "MENUNGGU_PEMBAYARAN") {
    throw new Error("Tidak dapat mengunggah bukti untuk tagihan ini.");
  }
  return {
    ...tagihan,
    urlBuktiBayar,
    tanggalUpload: new Date(),
    status: "MENUNGGU_KONFIRMASI",
  };
};


export const konfirmasiPembayaran = (tagihan, adminId) => {
  if (tagihan.status !== "MENUNGGU_KONFIRMASI") {
    throw new Error(
      "Hanya tagihan yang menunggu konfirmasi yang dapat diproses."
    );
  }
  return {
    ...tagihan,
    adminKonfirmasiId: adminId,
    tanggalKonfirmasi: new Date(),
    status: "LUNAS",
  };
};