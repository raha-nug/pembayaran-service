import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const save = async (tagihanData) => {
  return prisma.tagihanPembayaran.create({ data: tagihanData });
};

export const findByPendaftaranId = async (pendaftaranId) => {
  return prisma.tagihanPembayaran.findUnique({ where: { pendaftaranId } });
};

export const update = async (id, data) => {
  return prisma.tagihanPembayaran.update({ where: { id }, data });
};
export const getAllTagihan = async () => {
  return prisma.tagihanPembayaran.findMany();
};
