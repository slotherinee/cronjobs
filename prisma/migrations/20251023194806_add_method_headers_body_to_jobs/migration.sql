-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "body" TEXT,
ADD COLUMN     "headers" TEXT,
ADD COLUMN     "method" VARCHAR(10) NOT NULL DEFAULT 'GET';
