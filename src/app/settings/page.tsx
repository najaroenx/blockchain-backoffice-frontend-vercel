import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Settings() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">API Configuration</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="API Base URL" placeholder="https://api.example.com" />
              <Input label="API Key" type="password" placeholder="Enter your API key" />
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
