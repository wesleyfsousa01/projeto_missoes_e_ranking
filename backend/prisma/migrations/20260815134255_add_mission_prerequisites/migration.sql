-- CreateTable
CREATE TABLE "mission_prerequisites" (
    "missionId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,

    CONSTRAINT "mission_prerequisites_pkey" PRIMARY KEY ("missionId","prerequisiteId")
);

-- AddForeignKey
ALTER TABLE "mission_prerequisites" ADD CONSTRAINT "mission_prerequisites_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_prerequisites" ADD CONSTRAINT "mission_prerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
