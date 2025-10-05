import { useEffect, useState } from 'react';
import { SiInstagram, SiFacebook, SiLinkedin, SiX, SiPinterest } from 'react-icons/si';
import { Star, ExternalLink, Award, Users, TrendingUp, Heart, CheckCircle2, Sparkles, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/nowest_interior',
    icon: SiInstagram,
    color: 'hover:text-[#E4405F]',
    followers: '2.5K',
    engagement: 'Daily Updates',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/nowest.fitters/',
    icon: SiFacebook,
    color: 'hover:text-[#1877F2]',
    followers: '3.2K',
    engagement: 'Active Community',
  },
  {
    name: 'LinkedIn',
    url: 'https://uk.linkedin.com/in/nowest-interior-586366b5',
    icon: SiLinkedin,
    color: 'hover:text-[#0A66C2]',
    followers: '1.8K',
    engagement: 'Professional Network',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/nowestfitters',
    icon: SiX,
    color: 'hover:text-[#1DA1F2]',
    followers: '1.5K',
    engagement: 'Latest News',
  },
  {
    name: 'Pinterest',
    url: 'https://www.pinterest.com/nowestinterior/',
    icon: SiPinterest,
    color: 'hover:text-[#E60023]',
    followers: '4.1K',
    engagement: 'Design Inspiration',
  },
];

const reviewPlatforms = [
  {
    name: 'Google Reviews',
    url: 'https://goo.gl/maps/C3p484qPhSQ2',
    description: 'See what our customers say on Google',
    rating: '4.9',
    reviews: '127',
  },
  {
    name: 'Yell',
    url: 'https://www.yell.com/b/8176292',
    description: 'Read our verified Yell reviews',
    rating: '5.0',
    reviews: '43',
  },
  {
    name: 'Houzz',
    url: 'https://www.houzz.co.uk/pro/nowest-fitters/nowest-fitters',
    description: 'Explore our Houzz profile and reviews',
    rating: '4.8',
    reviews: '89',
  },
  {
    name: 'Trustpilot',
    url: 'https://uk.trustpilot.com/review/www.nowestfitters.co.uk',
    description: 'Check our Trustpilot ratings',
    rating: '4.9',
    reviews: '156',
  },
];

const achievements = [
  {
    icon: Award,
    title: '20+ Years',
    description: 'Industry Excellence',
    color: 'text-primary',
  },
  {
    icon: Users,
    title: '5,000+',
    description: 'Happy Clients',
    color: 'text-primary',
  },
  {
    icon: CheckCircle2,
    title: '98%',
    description: 'Satisfaction Rate',
    color: 'text-primary',
  },
  {
    icon: Heart,
    title: '10K+',
    description: 'Social Followers',
    color: 'text-primary',
  },
];

const testimonials = [
  {
    text: "Exceptional craftsmanship and attention to detail. The curtains transformed our home completely!",
    author: "Sarah M.",
    role: "Homeowner, Hampstead",
  },
  {
    text: "Professional service from start to finish. Highly recommend Nowest Interior for luxury window treatments.",
    author: "David L.",
    role: "Property Developer",
  },
  {
    text: "The team went above and beyond. Beautiful blinds that exceeded our expectations.",
    author: "Emma R.",
    role: "Interior Designer",
  },
];

export default function SocialReviews() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

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

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Header */}
        <div
          id="header"
          data-animate
          className={`text-center mb-20 relative transition-all duration-1000 ${
            isVisible('header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text" data-testid="text-social-reviews-title">
            Connect With Us
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 animate-pulse" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Follow our journey, explore our latest projects, and discover what our clients have to say about their experience with Nowest Interior Ltd.
          </p>
        </div>

        {/* Achievements Grid */}
        <section
          id="achievements"
          data-animate
          className={`mb-24 transition-all duration-1000 ${
            isVisible('achievements') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={achievement.title}
                className={`p-6 md:p-8 text-center hover-elevate active-elevate-2 transition-all duration-700 relative overflow-hidden group ${
                  isVisible('achievements') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                data-testid={`card-achievement-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <achievement.icon className={`w-7 h-7 md:w-8 md:h-8 ${achievement.color} group-hover:animate-pulse`} />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-1 text-primary">{achievement.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{achievement.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Media Section */}
        <section
          id="social-media"
          data-animate
          className={`mb-24 transition-all duration-1000 ${
            isVisible('social-media') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <p className="text-primary text-sm font-medium tracking-wider uppercase">Social Presence</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-social-media-heading">
              Follow Our Work
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with our latest projects, design inspiration, and behind-the-scenes content
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredSocial(social.name)}
                onMouseLeave={() => setHoveredSocial(null)}
                className={`group transition-all duration-700 ${
                  isVisible('social-media') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                data-testid={`link-social-${social.name.toLowerCase()}`}
              >
                <Card className={`p-6 hover-elevate active-elevate-2 transition-all duration-300 relative overflow-hidden ${
                  hoveredSocial === social.name ? 'shadow-xl scale-105' : ''
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-primary/20 ${social.color}`}>
                      <social.icon className="w-8 h-8 transition-transform duration-300" />
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-sm block group-hover:text-primary transition-colors">{social.name}</span>
                      <span className="text-xs text-primary font-medium block mt-1">{social.followers}</span>
                      <span className="text-xs text-muted-foreground block">{social.engagement}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          data-animate
          className={`mb-24 transition-all duration-1000 ${
            isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Quote className="w-5 h-5 text-primary" />
              <p className="text-primary text-sm font-medium tracking-wider uppercase">Client Stories</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`p-8 hover-elevate active-elevate-2 transition-all duration-700 relative overflow-hidden group ${
                  isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                data-testid={`card-testimonial-${index}`}
              >
                <div className="absolute top-6 left-6 text-primary/10 transition-all duration-500 group-hover:scale-125 group-hover:text-primary/20">
                  <Quote className="w-12 h-12" />
                </div>
                <div className="relative pt-8">
                  <p className="text-muted-foreground italic mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section
          id="reviews"
          data-animate
          className={`transition-all duration-1000 ${
            isVisible('reviews') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-primary animate-pulse" />
              <p className="text-primary text-sm font-medium tracking-wider uppercase">Verified Reviews</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-reviews-heading">
              Customer Reviews
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Read authentic reviews from our satisfied clients across multiple trusted platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviewPlatforms.map((platform, index) => (
              <Card
                key={platform.name}
                className={`p-6 md:p-8 hover-elevate active-elevate-2 transition-all duration-700 group relative overflow-hidden ${
                  isVisible('reviews') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                data-testid={`card-review-${platform.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {platform.name}
                      </h3>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="font-bold text-primary">{platform.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{platform.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 transition-all duration-300 ${
                          i < Math.floor(parseFloat(platform.rating))
                            ? 'text-primary fill-primary scale-100'
                            : 'text-muted-foreground/30'
                        }`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {platform.description}
                  </p>

                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto"
                    data-testid={`button-review-${platform.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Button variant="outline" className="w-full gap-2 group/btn">
                      View All Reviews
                      <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div
            className={`mt-16 relative overflow-hidden rounded-lg transition-all duration-1000 delay-700 ${
              isVisible('reviews') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb,194,163,104),0.1),transparent_70%)]" />
            <div className="relative p-8 md:p-12 text-center border border-primary/20">
              <div className="inline-flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary animate-pulse" />
                <p className="text-primary text-sm font-medium tracking-wider uppercase">Share Your Experience</p>
                <Heart className="w-5 h-5 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Had an Experience With Us?
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                We'd love to hear your feedback. Share your experience on any of the platforms above.
              </p>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Your reviews help us improve and assist others in making informed decisions about their luxury window treatment needs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
