
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/jsonDb";

export const runtime = "nodejs";

interface DeviceRecord {
  id: number;
  resourceName: string;
  deviceName: string;
  createdAt: string;
  lastSeenAt: string;
}

interface DevicesDb {
  lastDeviceId: number;
  devices: DeviceRecord[];
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const resourceName = String(body?.resourceName ?? "").trim();
  const deviceName = String(body?.deviceName ?? "").trim();

  if (!resourceName || !deviceName) {
    return NextResponse.json(
      { error: "resourceName and deviceName are required" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  const db = await readJsonFile<DevicesDb>("devices.json", {
    lastDeviceId: 0,
    devices: [],
  });

  let device = db.devices.find(
    (d) => d.resourceName === resourceName && d.deviceName === deviceName
  );

  if (!device) {
    const newId = db.lastDeviceId + 1;
    device = {
      id: newId,
      resourceName,
      deviceName,
      createdAt: now,
      lastSeenAt: now,
    };
    db.lastDeviceId = newId;
    db.devices.push(device);
  } else {
    device.lastSeenAt = now;
  }

  await writeJsonFile("devices.json", db);

  return NextResponse.json({
    deviceId: device.id,
    resourceName: device.resourceName,
    deviceName: device.deviceName,
    lastSeenAt: device.lastSeenAt,
  });
}
