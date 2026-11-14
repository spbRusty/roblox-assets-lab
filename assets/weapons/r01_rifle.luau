--[[
    R-01 Modular Rifle | Roblox Assets Lab
    Run in Roblox Studio's Command Bar while NOT in Play mode.
    Creates a decorative, non-functional weapon prop from native Parts.
]]

local CONFIG = {
    ModelName = "R01_Rifle",
    Origin = Vector3.new(0, 5, 0),
    Scale = 1,
    MainColor = Color3.fromRGB(48, 54, 57),
    DarkColor = Color3.fromRGB(25, 29, 32),
    MetalColor = Color3.fromRGB(105, 113, 116),
    AccentColor = Color3.fromRGB(102, 91, 65),
    PolymerColor = Color3.fromRGB(65, 70, 67),
}

local old = workspace:FindFirstChild(CONFIG.ModelName)
if old then old:Destroy() end

local model = Instance.new("Model")
model.Name = CONFIG.ModelName
model.Parent = workspace

local S = CONFIG.Scale
local O = CONFIG.Origin

local function v(x, y, z)
    return O + Vector3.new(x * S, y * S, z * S)
end

local function part(name, size, pos, color, material, shape, rot)
    local p = Instance.new("Part")
    p.Name = name
    p.Size = Vector3.new(size.X * S, size.Y * S, size.Z * S)
    p.Position = v(pos.X, pos.Y, pos.Z)
    p.Color = color
    p.Material = material or Enum.Material.Metal
    p.TopSurface = Enum.SurfaceType.Smooth
    p.BottomSurface = Enum.SurfaceType.Smooth
    p.CanCollide = false
    p.CastShadow = true
    if shape then p.Shape = shape end
    if rot then p.CFrame = CFrame.new(p.Position) * rot end
    p.Parent = model
    return p
end

local function box(name, x, y, z, sx, sy, sz, color, material, rz)
    return part(name, Vector3.new(sx, sy, sz), Vector3.new(x, y, z),
        color, material, nil, rz and CFrame.Angles(0, 0, math.rad(rz)) or nil)
end

local function cylinderX(name, x, y, z, length, diameter, color, material)
    return part(name, Vector3.new(length, diameter, diameter), Vector3.new(x, y, z),
        color, material, Enum.PartType.Cylinder, CFrame.Angles(0, 0, math.rad(90)))
end

local function cylinderY(name, x, y, z, diameter, height, color, material)
    return part(name, Vector3.new(diameter, height, diameter), Vector3.new(x, y, z),
        color, material, Enum.PartType.Cylinder)
end

local function wedge(name, x, y, z, sx, sy, sz, color, rz)
    local p = Instance.new("WedgePart")
    p.Name = name
    p.Size = Vector3.new(sx * S, sy * S, sz * S)
    p.Position = v(x, y, z)
    p.Color = color
    p.Material = Enum.Material.SmoothPlastic
    p.CanCollide = false
    p.TopSurface = Enum.SurfaceType.Smooth
    p.BottomSurface = Enum.SurfaceType.Smooth
    if rz then p.CFrame = p.CFrame * CFrame.Angles(0, 0, math.rad(rz)) end
    p.Parent = model
    return p
end

local M, D, MET, A, P = CONFIG.MainColor, CONFIG.DarkColor, CONFIG.MetalColor, CONFIG.AccentColor, CONFIG.PolymerColor
local metal, polymer = Enum.Material.Metal, Enum.Material.SmoothPlastic

-- Rear stock
box("Stock_Core", -4.05, 0, 0, 2.25, 0.72, 0.82, P, polymer)
box("Stock_Rear_Pad", -5.23, -0.02, 0, 0.22, 0.88, 0.9, D, polymer)
box("Stock_Top_Ridge", -4.15, 0.43, 0, 1.65, 0.12, 0.7, M, polymer)
box("Stock_Adjustment_Rail", -3.2, -0.04, 0, 0.22, 0.42, 0.88, MET, metal)
for i = 0, 3 do
    box("Stock_Slot_" .. i, -4.75 + i * 0.32, -0.01, -0.416, 0.12, 0.38, 0.025, D, metal)
end

-- Layered receiver
box("Lower_Receiver", -0.45, 0, 0, 3.55, 0.82, 0.82, M, metal)
box("Upper_Receiver", -0.25, 0.48, 0, 3.2, 0.24, 0.72, D, metal)
box("Left_Receiver_Panel", -0.35, 0.02, -0.43, 1.75, 0.48, 0.055, P, polymer)
box("Right_Receiver_Panel", -0.35, 0.02, 0.43, 1.75, 0.48, 0.055, P, polymer)
box("Ejection_Port", 0.65, 0.17, -0.47, 0.7, 0.22, 0.035, D, metal)
box("Ejection_Port_Cover", 0.65, 0.31, -0.49, 0.58, 0.055, 0.035, MET, metal)
box("Charging_Handle", -0.95, 0.57, -0.47, 0.48, 0.12, 0.12, MET, metal)

-- Barrel and muzzle
box("Handguard_Core", 2.0, 0.02, 0, 2.65, 0.72, 0.78, P, polymer)
cylinderX("Barrel", 3.55, 0.02, 0, 2.15, 0.24, MET, metal)
cylinderX("Muzzle_Brake", 4.78, 0.02, 0, 0.5, 0.34, D, metal)
cylinderX("Muzzle_Rim", 5.05, 0.02, 0, 0.08, 0.38, MET, metal)
cylinderX("Gas_Block", 2.72, 0.02, 0, 0.32, 0.48, M, metal)
box("Gas_Tube", 1.75, 0.48, 0, 1.65, 0.1, 0.12, MET, metal)

-- Handguard vents
for i = 0, 5 do
    local x = 1.05 + i * 0.34
    box("Vent_L_" .. i, x, 0.03, -0.405, 0.19, 0.12, 0.025, D, metal)
    box("Vent_R_" .. i, x, 0.03, 0.405, 0.19, 0.12, 0.025, D, metal)
end

-- Top Picatinny rail
box("Top_Rail_Base", 0.55, 0.64, 0, 4.45, 0.12, 0.22, D, metal)
for i = 0, 21 do
    box("Top_Rail_Tooth_" .. i, -1.55 + i * 0.2, 0.75, 0, 0.105, 0.12, 0.34, MET, metal)
end

-- Side rails
box("Left_Side_Rail", 1.95, 0.02, -0.47, 2.25, 0.16, 0.12, D, metal)
box("Right_Side_Rail", 1.95, 0.02, 0.47, 2.25, 0.16, 0.12, D, metal)
for i = 0, 8 do
    local x = 1.05 + i * 0.23
    box("Side_Tooth_L_" .. i, x, 0.02, -0.55, 0.12, 0.2, 0.08, MET, metal)
    box("Side_Tooth_R_" .. i, x, 0.02, 0.55, 0.12, 0.2, 0.08, MET, metal)
end

-- Grip
box("Grip_Mount", -0.8, -0.55, 0, 0.62, 0.18, 0.58, D, metal)
wedge("Pistol_Grip", -0.72, -1.03, 0, 0.72, 1.05, 0.62, P, 0)
box("Grip_Base", -0.55, -1.53, 0, 0.55, 0.14, 0.65, D, polymer)
for i = 0, 3 do
    box("Grip_Texture_" .. i, -0.84, -0.82 - i * 0.17, -0.326, 0.42, 0.035, 0.025, D, metal)
end

-- Magazine
box("Magazine_Neck", 0.15, -0.55, 0, 0.62, 0.36, 0.58, D, metal)
box("Magazine_Body", 0.18, -1.05, 0, 0.72, 0.78, 0.62, P, polymer, -5)
box("Magazine_Lower", 0.23, -1.48, 0, 0.66, 0.16, 0.58, D, metal, -5)
box("Magazine_Floorplate", 0.23, -1.59, 0, 0.78, 0.1, 0.68, MET, metal, -5)
for i = 0, 4 do
    box("Magazine_Rib_" .. i, 0.18, -0.82 - i * 0.13, -0.323, 0.48, 0.035, 0.025, D, metal)
end

-- Trigger assembly and selector
box("Trigger_Guard_Top", -0.72, -0.42, 0, 0.72, 0.09, 0.48, MET, metal)
box("Trigger_Guard_Front", -0.38, -0.58, 0, 0.09, 0.25, 0.48, MET, metal)
box("Trigger_Guard_Rear", -1.05, -0.58, 0, 0.09, 0.25, 0.48, MET, metal)
box("Trigger", -0.72, -0.52, 0, 0.08, 0.25, 0.1, MET, metal, -12)
cylinderY("Selector_Axle", -0.95, 0.06, -0.49, 0.18, 0.12, MET, metal)
box("Selector_Lever", -0.78, 0.08, -0.53, 0.34, 0.07, 0.08, A, metal, -18)

-- Iron sights
box("Front_Sight_Base", 2.78, 0.88, 0, 0.38, 0.14, 0.42, D, metal)
box("Front_Sight_Post", 2.78, 1.12, 0, 0.07, 0.38, 0.07, MET, metal)
box("Front_Sight_Hood_L", 2.58, 1.12, 0, 0.07, 0.34, 0.1, MET, metal)
box("Front_Sight_Hood_R", 2.98, 1.12, 0, 0.07, 0.34, 0.1, MET, metal)
box("Rear_Sight_Base", -1.18, 0.9, 0, 0.42, 0.16, 0.38, D, metal)
box("Rear_Sight_Housing", -1.18, 1.08, 0, 0.34, 0.22, 0.32, MET, metal)
box("Rear_Sight_Aperture", -1.18, 1.1, 0, 0.12, 0.13, 0.34, D, metal)

-- Compact optic
box("Optic_Mount", 0.0, 0.92, 0, 0.68, 0.18, 0.48, D, metal)
box("Optic_Body", 0.0, 1.2, 0, 0.78, 0.42, 0.54, M, metal)
cylinderX("Optic_Front_Ring", 0.42, 1.2, 0, 0.12, 0.5, MET, metal)
cylinderX("Optic_Rear_Ring", -0.42, 1.2, 0, 0.12, 0.5, MET, metal)
box("Optic_Glass_Front", 0.49, 1.2, 0, 0.025, 0.32, 0.32, Color3.fromRGB(68, 111, 119), Enum.Material.Glass)
box("Optic_Glass_Rear", -0.49, 1.2, 0, 0.025, 0.32, 0.32, Color3.fromRGB(68, 111, 119), Enum.Material.Glass)
box("Optic_Turret", 0.0, 1.49, 0, 0.22, 0.16, 0.22, D, metal)
box("Optic_Turret_Cap", 0.0, 1.59, 0, 0.28, 0.06, 0.28, MET, metal)

-- Fasteners and finish details
for _, side in ipairs({-1, 1}) do
    for i = 0, 3 do
        cylinderY("Receiver_Fastener_" .. side .. "_" .. i,
            -1.05 + i * 0.43, 0.04, side * 0.475, 0.09, 0.035, MET, metal)
    end
    for i = 0, 4 do
        box("Handguard_Mark_" .. side .. "_" .. i,
            1.05 + i * 0.32, 0.34, side * 0.414, 0.12, 0.035, A, metal)
    end
end

-- Sling attachment points
box("Rear_Sling_Lug", -3.0, -0.32, 0, 0.18, 0.16, 0.94, MET, metal)
box("Front_Sling_Lug", 2.55, -0.34, 0, 0.16, 0.14, 0.9, MET, metal)

model.PrimaryPart = model:FindFirstChild("Lower_Receiver")
print("Created " .. CONFIG.ModelName .. " with " .. #model:GetChildren() .. " parts.")
