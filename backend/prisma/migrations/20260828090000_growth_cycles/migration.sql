-- Create reusable growth-cycle templates and their ordered stages.
CREATE TABLE "GrowthCycle" (
    "id" UUID NOT NULL,
    "cropId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "GrowthCycle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GrowthStage" (
    "id" UUID NOT NULL,
    "growthCycleId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "GrowthStage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CropCycle" ADD COLUMN "growthCycleId" UUID;

CREATE UNIQUE INDEX "GrowthStage_growthCycleId_sequence_key" ON "GrowthStage"("growthCycleId", "sequence");
ALTER TABLE "GrowthCycle" ADD CONSTRAINT "GrowthCycle_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GrowthStage" ADD CONSTRAINT "GrowthStage_growthCycleId_fkey" FOREIGN KEY ("growthCycleId") REFERENCES "GrowthCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CropCycle" ADD CONSTRAINT "CropCycle_growthCycleId_fkey" FOREIGN KEY ("growthCycleId") REFERENCES "GrowthCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
