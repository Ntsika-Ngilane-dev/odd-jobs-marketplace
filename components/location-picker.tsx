"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Navigation } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
  initialLocation?: { address: string; lat: number; lng: number }
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(initialLocation?.address || "")
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [suggestions, setSuggestions] = useState<
    Array<{
      address: string
      lat: number
      lng: number
    }>
  >([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // Simulate location search results
    if (query.length > 2) {
      const mockSuggestions = [
        { address: `${query}, Johannesburg, South Africa`, lat: -26.2041, lng: 28.0473 },
        { address: `${query}, Cape Town, South Africa`, lat: -33.9249, lng: 18.4241 },
        { address: `${query}, Durban, South Africa`, lat: -29.8587, lng: 31.0218 },
        { address: `${query}, Pretoria, South Africa`, lat: -25.7479, lng: 28.2293 },
      ]
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setSelectedLocation(location)
    setSearchQuery(location.address)
    setSuggestions([])
    onLocationSelect(location)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            address: "Current Location",
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          handleLocationSelect(location)
        },
        (error) => {
          console.log("[v0] Geolocation error:", error)
        },
      )
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="location-search">Job Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="location-search"
              placeholder="Enter address or area..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={getCurrentLocation}
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search suggestions */}
        {suggestions.length > 0 && (
          <div className="border rounded-lg divide-y">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left p-3 hover:bg-muted transition-colors flex items-center gap-2"
                onClick={() => handleLocationSelect(suggestion)}
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{suggestion.address}</span>
              </button>
            ))}
          </div>
        )}

        {/* Selected location preview */}
        {selectedLocation && (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Selected Location</span>
            </div>
            <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>

            {/* Mini map preview */}
            <div className="mt-3 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
