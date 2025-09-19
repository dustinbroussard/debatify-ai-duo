import heroImage from "@/assets/hero-debate.jpg";

export const Header = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      {/* Hero Image Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ai1/20 via-transparent to-ai2/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center py-16 px-8">
        <h1 className="text-4xl lg:text-6xl font-bold gradient-text mb-6 animate-glow">
          Synthetica Debates
        </h1>
        <p className="text-xl lg:text-2xl text-muted-foreground mb-4 font-light">
          AI vs AI: Where Ideas Collide
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <span>Advanced AI Models</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-ai1 rounded-full animate-pulse" />
            <span>Real-time Debates</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-ai2 rounded-full animate-pulse" />
            <span>Export & Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};