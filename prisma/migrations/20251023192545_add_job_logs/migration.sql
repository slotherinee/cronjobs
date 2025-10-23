-- CreateTable
CREATE TABLE "job_logs" (
    "id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "status_code" INTEGER,
    "response" TEXT,
    "duration" INTEGER,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_logs_job_id_executed_at_idx" ON "job_logs"("job_id", "executed_at");

-- AddForeignKey
ALTER TABLE "job_logs" ADD CONSTRAINT "job_logs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
