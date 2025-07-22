import * as domain from "../domain/pembayaranDomain.js";
import * as repository from "../infrastructure/pembayaranRepository.js";
// import { publishEvent } from '../infrastructure/eventBroker.js';

/**
 * Use Case yang dipicu oleh event `PendaftaranBerhasilDiajukanEvent`.
 */
export const createTagihanUseCase = async ({
  pendaftaranId,
  calonMahasiswaId,
}) => {
  const existingTagihan = await repository.findByPendaftaranId(pendaftaranId);
  if (existingTagihan) return existingTagihan;

  const tagihanData = domain.createTagihan({
    pendaftaranId,
    calonMahasiswaId,
    jumlah: 150000, // Contoh biaya pendaftaran
    deskripsi: "Biaya Pendaftaran Mahasiswa Baru",
  });

  return repository.save(tagihanData);
};

/**
 * Use Case untuk B2. Unggah Bukti Pembayaran.
 */
export const uploadBuktiBayarUseCase = async ({
  pendaftaranId,
  userId,
  urlBuktiBayar,
}) => {
  const tagihan = await repository.findByPendaftaranId(pendaftaranId);
  if (!tagihan || tagihan.calonMahasiswaId !== userId) {
    throw new Error("Tagihan tidak ditemukan atau akses ditolak.");
  }

  const tagihanBaru = domain.prosesUploadBukti(tagihan, urlBuktiBayar);
  return repository.update(tagihan.id, tagihanBaru);
};

/**
 * Use Case untuk A7. Konfirmasi Pembayaran oleh Admin.
 */
export const adminKonfirmasiPembayaranUseCase = async ({
  pendaftaranId,
  adminId,
}) => {
  const tagihan = await repository.findByPendaftaranId(pendaftaranId);
  if (!tagihan) throw new Error("Tagihan tidak ditemukan.");

  const tagihanTerkonfirmasi = domain.konfirmasiPembayaran(tagihan, adminId);
  const tagihanFinal = await repository.update(
    tagihan.id,
    tagihanTerkonfirmasi
  );

  // Terbitkan event bahwa pembayaran sudah lunas!
  // Ini akan didengar oleh Seleksi Service.
  // publishEvent('PembayaranTerkonfirmasiEvent', {
  //   pendaftaranId: tagihanFinal.pendaftaranId,
  //   calonMahasiswaId: tagihanFinal.calonMahasiswaId,
  //   gelombangId: 'DIAMBIL_DARI_DATA_PENDAFTARAN' // Data ini perlu diperkaya
  // });

  return tagihanFinal;
};

export const getTagihanUseCase = async (pendaftaranId) => {
  const tagihan = await repository.findByPendaftaranId(pendaftaranId);

  return tagihan;
};
