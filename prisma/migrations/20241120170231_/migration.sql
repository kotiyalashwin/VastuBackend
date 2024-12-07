-- CreateTable
CREATE TABLE "ProjectFloor" (
    "id" SERIAL NOT NULL,
    "floornumber" INTEGER NOT NULL,
    "description" TEXT,
    "floorplan" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectFloor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectFloor" ADD CONSTRAINT "ProjectFloor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
