import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Clients = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });

  const clients = [
    {
      name: "Universities",
      description: "Academic institutions across Nigeria",
    },
    {
      name: "Research Institutes",
      description: "Government and private research bodies",
    },
    {
      name: "Graduate Students",
      description: "ND, HND, BSc, PGD, MSc & PhD candidates",
    },
    {
      name: "Corporate Organizations",
      description: "Business proposals and reports",
    },
    {
      name: "NGOs & Non-Profits",
      description: "Grant proposals and impact reports",
    },
    {
      name: "Individual Clients",
      description: "Personal and professional projects",
    },
  ];

  const stats = [
    { value: "500+", label: "Projects Completed" },
    { value: "200+", label: "Satisfied Clients" },
    { value: "10+", label: "Years Experience" },
    { value: "100%", label: "Client Satisfaction" },
  ];

  return (
    <section id="clients" className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div 
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
            Trusted By Many
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Clients I've Worked With
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Delivering excellence to diverse clients across various sectors
          </p>
        </div>

        {/* Stats */}
        <div 
          ref={gridRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto transition-all duration-700 ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`text-center p-4 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 ${
                gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Client Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {clients.map((client, index) => (
            <div
              key={client.name}
              className={`p-5 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all duration-500 group ${
                gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                {client.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {client.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
