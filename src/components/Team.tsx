import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShieldCheck, HeartPulse, GraduationCap } from 'lucide-react';
import teamTruck from '@/assets/team-truck.png';
import team1 from '@/assets/team-1.png';
import team2 from '@/assets/team-2.png';

const teamMembers = [
    {
        name: 'Roberto',
        role: 'Founder & Head Gardener',
        bio: 'With over 15 years of experience in horticulture, Roberto lead the team with a passion for transforming outdoor spaces into lush, profitable assets.',
        image: teamTruck, // Use team truck as his lead image or 
        icon: GraduationCap
    },
    {
        name: 'Sarah',
        role: 'Pre-Sale Specialist',
        bio: 'Sarah coordinates our property makeover blitzes, ensuring every detail from mulching to waterblasting is perfect for the camera.',
        image: team1,
        icon: ShieldCheck
    },
    {
        name: 'Marcus',
        role: 'Maintenance Lead',
        bio: 'Marcus oversees our routine care and strata contracts, bringing precision and reliability to every garden he touches.',
        image: team2,
        icon: HeartPulse
    },
    {
        name: 'Join the Team',
        role: 'Outdoor Specialist',
        bio: 'We are always looking for passionate gardeners to join our growing family on the Northern Beaches.',
        image: null,
        icon: Users,
        isHiring: true
    }
];

export const Team = () => {
    return (
        <section id="team" className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-medium text-sm uppercase tracking-wider">The Faces Behind the Gardens</span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                        Meet the Team
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Professional, reliable, and passionate about your property. Our dedicated crew is what makes the "Rob's Gardens" difference.
                    </p>
                </motion.div>

                {/* Hero Team Shot */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative max-w-5xl mx-auto mb-20 rounded-3xl overflow-hidden shadow-2xl group"
                >
                    <img
                        src={teamTruck}
                        alt="Roberto and the team with their signature garden truck"
                        className="w-full h-auto object-cover aspect-[21/9]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-12">
                        <div>
                            <h3 className="text-white font-serif text-2xl md:text-3xl font-bold mb-2">Roberto’s Signature Crew</h3>
                            <p className="text-white/80 max-w-xl">Fully equipped, insured, and ready to transform your property in 24-72 hours.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Individual Team Members */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 group">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <member.icon className="w-12 h-12 text-primary/20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-2 rounded-xl shadow-sm">
                                            <member.icon className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-serif text-xl font-bold text-foreground mb-1">{member.name}</h4>
                                        <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {member.bio}
                                        </p>
                                        {member.isHiring && (
                                            <a href="#contact" className="inline-block mt-4 text-primary font-bold text-sm hover:underline">
                                                Apply Now →
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
