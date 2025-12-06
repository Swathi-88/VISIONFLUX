export const Footer = () => {
  return (
    <footer className="section-padding bg-secondary/20 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-2xl mb-4">VisionFlux</h3>
            <p className="text-sm text-muted-foreground">
              Where the next wave of storytelling happens with AI
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">Features</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Tutorials</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Community</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">About</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Careers</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 VisionFlux. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
