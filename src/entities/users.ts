// Define the structure of our user data
export default interface Users {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  status: "active" | "inactive"
}
