"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import axios from "axios";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export default function UserRecordView() {
  const [userInfo, setUserInfo] = useState<User>({} as User);
  const [isEditing, setIsEditing] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };
  let { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      let dataUser = await axios.get(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/users/${id}`);
      setUserInfo({
        ...dataUser.data[0],
      });
    };
    if (id) {
      getData();
    }
  }, []);

  const handleSave = () => {
    const getData = async (params) => {
      if (!id) {
        await axios.post(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/users`, userInfo);
      } else {
        await axios.put(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/users/${id}`, userInfo);
      }
    };
    getData(userInfo);
    // Here you would typically send the updated user info to your backend
    setIsEditing(false);

    toast({
      title: "User information updated",
      description: "The user record has been successfully updated.",
    });

    navigate("/List");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User Record</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={userInfo.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={userInfo.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userInfo.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={userInfo.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={userInfo.state}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zip_code"
                name="zip_code"
                value={userInfo.zip_code}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </CardFooter>
    </Card>
  );
}
