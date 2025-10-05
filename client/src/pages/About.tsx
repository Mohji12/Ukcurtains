import { useState, useEffect } from 'react';
import ProcessTimeline from '@/components/ProcessTimeline';
import { Button } from '@/components/ui/button';
import { Star, Clock, Shield, Award, Heart, Users } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

import consultingImg from '@assets/stock_images/professional_interio_c6db885a.jpg';
import hotelImg from '@assets/stock_images/luxury_hotel_interio_aae16878.jpg';
import craftsmanImg from '@assets/stock_images/craftsman_hands_meas_b4cb2575.jpg';
import fabricImg from '@assets/stock_images/quality_fabric_sampl_1f799748.jpg';

export default function About() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const whyChooseFeatures = [
    {
      icon: Award,
      title: 'Top-Quality Products',
      description: 'All products manufactured in the UK to the highest possible standards with trusted suppliers.'
    },
    {
      icon: Star,
      title: '5-Star Customer Rating',
      description: 'Consistent 5-star ratings and positive feedback from every single customer we\'ve served.'
    },
    {
      icon: Clock,
      title: 'Fast Turnaround',
      description: 'One of the fastest turnaround times in the UK, from order to installation - without compromising quality.'
    },
    {
      icon: Shield,
      title: '2-Year Guarantee',
      description: 'Comprehensive guarantee covering all internal mechanisms, components, brackets, and fabrics.'
    },
    {
      icon: Users,
      title: 'Expert Craftsmen',
      description: 'Over 15 years of industry experience with a reputation for excellence, reliability, and craftsmanship.'
    },
    {
      icon: Heart,
      title: 'Personal Service',
      description: 'Friendly consultants guide you from enquiry to installation with honest advice and attention to detail.'
    }
  ];

  return (
    <div>
      <section className="relative py-8 md:py-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="animate-fade-slide-up">
            <p className="text-primary text-xs sm:text-sm font-medium tracking-wider uppercase mb-4">
              Welcome to Nowest Interior Ltd
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 px-4" data-testid="text-about-page-title">
              Crafting Beautiful Spaces Since 2002
            </h1>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mb-4 sm:mb-6" />
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
              It's often challenging to turn your interior dreams into reality. That's where we come in. 
              We help you design stunning spaces that reflect your personality and lifestyle.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            id="story-section"
            data-animate
            className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ${
              visibleSections.has('story-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Our Story
              </h2>
              <div className="space-y-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Nowest Interior Ltd began in 2002 under the name Norwest Fitters, starting as a small, family-run business. 
                  Over the years, our passion, dedication, and commitment to quality have helped us grow into a respected company 
                  known for excellence in both window treatments and installation services.
                </p>
                <p>
                  For more than 15 years, we've been proudly supplying and fitting a wide range of blinds and curtains, 
                  combining stylish design with precision craftsmanship.
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 group">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={consultingImg}
                  alt="Professional consultation for window treatments"
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>

          <div
            id="clients-section"
            data-animate
            className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-12 md:mt-16 transition-all duration-700 ${
              visibleSections.has('clients-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="group">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={hotelImg}
                  alt="Luxury hotel interior with elegant window treatments"
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Who We Work With
              </h2>
              <div className="space-y-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Over the years, we've had the privilege of working with a wide range of clients, including interior designers, 
                  property developers, estate agents, universities, hotels, and sports and leisure venues.
                </p>
                <p>
                  We're especially proud to have completed projects for several top Premier League football clubs, 
                  both in and outside London.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProcessTimeline />

      <section className="py-12 md:py-16 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose Nowest Interior Ltd
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              We believe every customer deserves exceptional quality, fair pricing, and a seamless experience from start to finish
            </p>
          </div>

          <div
            id="features-grid"
            data-animate
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyChooseFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isVisible = visibleSections.has('features-grid');
              return (
                <div
                  key={index}
                  className={`group p-6 md:p-8 rounded-md border border-border bg-background hover-elevate active-elevate-2 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  data-testid={`feature-card-${index}`}
                  style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              From free home consultations to professional installation, we handle every detail with care
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div
              id="home-visit-section"
              data-animate
              className={`transition-all duration-700 ${
                visibleSections.has('home-visit-section') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="group mb-6">
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={fabricImg}
                    alt="Quality fabric samples and materials"
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
                Free Home Visit Service
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Expert Advice:</strong>
                    <span className="text-muted-foreground"> Professional guidance tailored to your home and style</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Accurate Measuring:</strong>
                    <span className="text-muted-foreground"> Ensures perfect fit with a neat, flawless finish</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Sampling at Home:</strong>
                    <span className="text-muted-foreground"> See and feel fabrics in your own surroundings</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Price Match Guarantee:</strong>
                    <span className="text-muted-foreground"> Same products cheaper elsewhere? We'll match the price</span>
                  </div>
                </li>
              </ul>
            </div>

            <div
              id="fitting-section"
              data-animate
              className={`transition-all duration-700 ${
                visibleSections.has('fitting-section') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="group mb-6">
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={craftsmanImg}
                    alt="Professional installation and craftsmanship"
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
                Professional Fitting
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Expert Installation:</strong>
                    <span className="text-muted-foreground"> From single homes to commercial projects across the UK and Europe</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Fast & Friendly:</strong>
                    <span className="text-muted-foreground"> Professional service with minimal disruption to your home</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Clean & Tidy:</strong>
                    <span className="text-muted-foreground"> Punctual, respectful, leaving your property spotless</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground">Flexible Scheduling:</strong>
                    <span className="text-muted-foreground"> Including evenings and weekends to suit you</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="promise-section"
        data-animate
        className={`py-12 md:py-16 px-4 bg-card/30 transition-all duration-700 ${
          visibleSections.has('promise-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our Promise
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 px-4">
            At Nowest Interior Ltd, customer satisfaction is at the heart of everything we do. 
            Our fabulous range of products, combined with our professional fitting service, ensures that every customer 
            enjoys a seamless experience and a beautiful result.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 px-4">
            We're proud to have earned countless positive reviews and long-lasting relationships with customers 
            who continue to recommend us after more than two decades in business.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary">
            Your home deserves the best — and that's exactly what we deliver.
          </p>
        </div>
      </section>

      <section className="relative py-12 md:py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
        
        <div className="relative max-w-3xl mx-auto">
          <div className="animate-fade-slide-up">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 px-4 max-w-2xl mx-auto leading-relaxed">
              Book a free home consultation and discover how we can bring your interior dreams to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button
                size="lg"
                className="group w-full sm:w-auto"
                data-testid="button-start-consultation"
              >
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                data-testid="button-view-products"
              >
                View Our Products
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
