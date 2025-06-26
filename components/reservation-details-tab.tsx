"use client"

import type React from "react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Grid,
} from "@mui/material"

interface RoomUpgrade {
  id: number
  name: string
  description: string
  price: number
}

interface Attribute {
  id: number
  name: string
  value: string
}

interface Extra {
  id: number
  name: string
  description: string
  price: number
}

interface ReservationDetailsTabProps {
  reservationId: string // Example prop, adjust as needed
}

const ReservationDetailsTab: React.FC<ReservationDetailsTabProps> = ({ reservationId }) => {
  const [roomUpgrades, setRoomUpgrades] = useState<RoomUpgrade[]>([
    { id: 1, name: "Deluxe Room", description: "Spacious room with a view", price: 50 },
    { id: 2, name: "Suite", description: "Luxurious suite with separate living area", price: 100 },
  ])

  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: 1, name: "Check-in Time", value: "2:00 PM" },
    { id: 2, name: "Check-out Time", value: "12:00 PM" },
    { id: 3, name: "Number of Guests", value: "2" },
  ])

  const [extras, setExtras] = useState<Extra[]>([
    { id: 1, name: "Breakfast", description: "Continental breakfast", price: 15 },
    { id: 2, name: "Parking", description: "Valet parking", price: 20 },
    { id: 3, name: "Spa Access", description: "Access to the spa facilities", price: 30 },
  ])

  const [selectedRoomUpgrade, setSelectedRoomUpgrade] = useState<RoomUpgrade | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<number[]>([])

  const handleRoomUpgradeSelect = (upgrade: RoomUpgrade) => {
    setSelectedRoomUpgrade(upgrade)
  }

  const handleExtraSelect = (extraId: number) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter((id) => id !== extraId))
    } else {
      setSelectedExtras([...selectedExtras, extraId])
    }
  }

  const handleApplyChanges = () => {
    // Implement logic to apply the selected room upgrade and extras to the reservation
    console.log("Applying changes:", {
      selectedRoomUpgrade,
      selectedExtras,
    })
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Room Upgrade</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomUpgrades.map((upgrade) => (
                <TableRow key={upgrade.id}>
                  <TableCell>{upgrade.name}</TableCell>
                  <TableCell>{upgrade.description}</TableCell>
                  <TableCell>${upgrade.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={selectedRoomUpgrade?.id === upgrade.id ? "success" : "primary"}
                      onClick={() => handleRoomUpgradeSelect(upgrade)}
                    >
                      {selectedRoomUpgrade?.id === upgrade.id ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Attributes</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell>{attribute.name}</TableCell>
                  <TableCell>{attribute.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">CYR Map (Placeholder)</Typography>
        <div>
          {/* Placeholder for CYR Map component */}
          <Typography>CYR Map will be displayed here.</Typography>
        </div>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Extras</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {extras.map((extra) => (
                <TableRow key={extra.id}>
                  <TableCell>{extra.name}</TableCell>
                  <TableCell>{extra.description}</TableCell>
                  <TableCell>${extra.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={selectedExtras.includes(extra.id) ? "success" : "primary"}
                      onClick={() => handleExtraSelect(extra.id)}
                    >
                      {selectedExtras.includes(extra.id) ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleApplyChanges}>
          Apply Changes
        </Button>
      </Grid>
    </Grid>
  )
}

export default ReservationDetailsTab
