import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Phone, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSuburbBySlug, getAllSuburbs, type SuburbEntry } from "@/content/suburbs";

function SuburbSchema({ suburb }: { suburb: SuburbEntry }) {
  const canonicalUrl = `https://www.robgardens.com.au/gardening/${suburb.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${canonicalUrl}#business`,
    name: "Rob Gardening and Maintenance",
    description: suburb.metaDescription,
    url: canonicalUrl,
    logo: "https://www.robgardens.com.au/rob-gardens-logo.jpg",
    image: "https://www.robgardens.com.au/rob-gardens-logo.jpg",
    telephone: "+61468170318",
    email: "info@robgardens.com.au",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: suburb.name,
      addressRegion: "NSW",
      postalCode: suburb.postcode,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: suburb.lat,
      longitude: suburb.lng,
    },
    areaServed: {
      "@type": "Place",
      name: `${suburb.name}, Sydney NSW ${suburb.postcode}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: suburb.lat,
        longitude: suburb.lng,
      },
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "07:00",
        closes: "17:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function SuburbPage() {
  const { slug } = useParams<{ slug: string }>();
  const suburb = slug ? getSuburbBySlug(slug) : undefined;

  useEffect(() => {
    if (!suburb) return;
    document.title = suburb.metaTitle;
    setMeta("description", suburb.metaDescription);
    setMeta("og:title", suburb.metaTitle, "property");
    setMeta("og:description", suburb.metaDescription, "property");
    setMeta(
      "og:url",
      `https://www.robgardens.com.au/gardening/${suburb.slug}`,
      "property",
    );
    setCanonical(`https://www.robgardens.com.au/gardening/${suburb.slug}`);
  }, [suburb]);

  if (!suburb) {
    return <Navigate to="/not-found" replace />;
  }

  const neighbourEntries = suburb.neighbours
    .map((slug) => getAllSuburbs().find((s) => s.slug === slug))
    .filter((s): s is SuburbEntry => Boolean(s));

  return (
    <div className="min-h-screen bg-background">
      <SuburbSchema suburb={suburb} />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span>{suburb.region} · Postcode {suburb.postcode}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            {suburb.primaryService} in {suburb.name}
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
            {suburb.metaDescription}
          </p>

          <article className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-primary prose-headings:text-foreground prose-p:text-foreground/85 prose-li:text-foreground/85">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {suburb.body}
            </ReactMarkdown>
          </article>

          {neighbourEntries.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                Also serving nearby
              </h2>
              <div className="flex flex-wrap gap-3">
                {neighbourEntries.map((n) => (
                  <Link
                    key={n.slug}
                    to={`/gardening/${n.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    {n.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 p-8 rounded-lg bg-card border border-border text-center">
            <h2 className="font-serif text-2xl font-semibold mb-3">
              Ready to book?
            </h2>
            <p className="text-muted-foreground mb-6">
              Call Rob direct or send a message via the contact form. First
              visits always take longer than the ongoing ones — after that
              we're in and out on schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+61468170318">
                <Button variant="hero" size="lg">
                  <Phone className="w-4 h-4" /> 0468 170 318
                </Button>
              </a>
              <a href="/#contact">
                <Button variant="outline" size="lg">
                  Send a message
                </Button>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function setMeta(name: string, content: string, attrKey: "name" | "property" = "name") {
  let el = document.querySelector(
    `meta[${attrKey}="${name}"]`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrKey, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
