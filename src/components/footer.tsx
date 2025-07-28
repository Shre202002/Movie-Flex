export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} All Movies Download.</p>
        <p className="mt-1">This content may include material that is copied or adapted from sources in the public domain. It is provided for educational and informational purposes only. No copyright infringement is intended. All rights to respective owners where applicable.</p>
      </div>
    </footer>
  );
}
