export function DashboardFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between text-sm text-gray-500">
        <span>© {new Date().getFullYear()} QRAuth</span>
        <span>Secure · Fast · Reliable</span>
      </div>
    </footer>
  );
}
