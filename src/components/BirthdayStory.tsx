import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
// import confettiImage from "@/assets/celebration-confetti.jpg";
import doorKnockImage from "@/assets/door-knock.jpg";
import TypingText from "./TypingText";
import RandomCharacterReveal from "./RandomCharacterReveal";
import FireworksCanvas from "./FireworksCanvas";
import BalloonsAnimation from "./BalloonsAnimation";
import FlashyImage from "./SliceAnimation";

// Sample team members data - replace with real data
const teamMembers = [
  {
    name: "Bryan Sambieni",
    message: "Good evening Sabine, hope you are doing well? I wish you a happy birthday and many more years to come. May God bless you and your family abundantly, more grace, health and prosperity. Thanks alot for everything you have done for us, remain blessed. 🎉🎂🎈",
    role: "Frontend Developer",
  },
  {
    name: "Sylvanus B.",
    message:
      "A notre boss préféré, on a gardé le meilleur pour la fin. On pouvait pas vous oublier quand même. Merci pour l'année qu'on a passé ensemble, les bons moments (Atassi's day) et les bon conseils et surtout les bundle (Ouiii). Happy birthday to you boss! Wish you the best, a great health to overcome all your challenges and achieve your goals! Enjoy your day🎂",
    role: "Backend Developer",
  }
  // ,
  // {
  //   name: "Mike Johnson",
  //   message: "Another year of greatness! Have an incredible celebration! 🥳",
  //   role: "Backend Developer",
  // },
  // {
  //   name: "Emma Wilson",
  //   message: "Celebrating you today and always! Happy Birthday boss! 🎈",
  //   role: "Product Manager",
  // },
];
const BirthdayStory = () => {
  const [currentScene, setCurrentScene] = useState(1);
  const [knocksShown, setKnocksShown] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [textComplete, setTextComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  // Ref to store the Audio object
  const celebrationAudioRef = useRef<HTMLAudioElement | null>(null);

  // Create knock sound effect using Web Audio API
  const playKnockSound = () => {
    const audio = new Audio("/wood-door-knock.ogg");
    audio.play().catch((err) => {
      console.error("Failed to play knock sound:", err);
    });
  };

  // Auto-advance knock animation with sound
  // Auto-advance knock animation with sound
  useEffect(() => {
    if (currentScene === 0 && knocksShown < 3) {
      const timer = setTimeout(() => {
        setKnocksShown((prev) => {
          const next = prev + 1;
          playKnockSound(); // 👈 play sound in sync with text
          return next;
        });
      }, 3000); // 5s interval (3s audio + pause)

      return () => clearTimeout(timer);
    }
  }, [currentScene, knocksShown]);

  // Auto-advance to next scene after knocks
  useEffect(() => {
    if (currentScene === 0 && knocksShown === 3) {
      const timer = setTimeout(() => {
        setCurrentScene(1);
        setTextComplete(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentScene, knocksShown]);

  // Auto-advance scenes with timing
  useEffect(() => {
    if (textComplete) {
      const timer = setTimeout(() => {
        if (currentScene === 1) {
          setCurrentScene(2);
          setTextComplete(false);
        } else if (currentScene === 2) {
          setCurrentScene(3);
          setTextComplete(false);
        } else if (currentScene === 5) {
          setCurrentScene(6);
          setTextComplete(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [textComplete, currentScene]);

  // Auto-advance fireworks scene
  useEffect(() => {
    if (currentScene === 4) {
      const timer = setTimeout(() => {
        setCurrentScene(5);
        setTextComplete(false);
      }, 6000); // Show fireworks for 6 seconds
      return () => clearTimeout(timer);
    }
  }, [currentScene]);

  // Initialize celebration audio once
  useEffect(() => {
    if (!celebrationAudioRef.current) {
      const audio = new Audio("/happybirthday.mp3");
      audio.loop = true; // if you want looping
      celebrationAudioRef.current = audio;
    }
  }, []);

  // Play celebration sound when scene >= 2
  useEffect(() => {
    if (celebrationAudioRef.current) {
      if (currentScene >= 4) {
        // Play the audio once (or loop if set)
        celebrationAudioRef.current.play().catch((err) => console.error(err));
      } else {
        // Pause and reset the audio when leaving scene 2+
        celebrationAudioRef.current.pause();
        celebrationAudioRef.current.currentTime = 0;
      }
    }
  }, [currentScene]);

  const nextScene = () => {
    if (currentScene < 7) {
      setCurrentScene((prev) => prev + 1);
      setTextComplete(false);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene((prev) => prev - 1);
      setTextComplete(false);
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevCard = () => {
    setCurrentCardIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  const startStory = () => {
    setIsPlaying(true);
    setCurrentScene(0);
    setKnocksShown(0);
    setCurrentCardIndex(0);
    setTextComplete(false);
  };

    const handleSceneComplete = () => {
    setIsExiting(true); // start fade-out/slide-out
    setTimeout(() => {
      setIsExiting(false);
      setCurrentScene(prev => prev + 1); // go to next scene
    }, 800); // match your animation duration
  };

  // if (!isPlaying) {
  //   return (
  //     <div className="min-h-screen bg-gradient-background flex items-center justify-center p-6">
  //       <div className="text-center space-y-8 animate-text-reveal">
  //         <div className="space-y-4">
  //           <h1 className="text-6xl font-bold bg-gradient-party bg-clip-text text-transparent">
  //             Birthday Story
  //           </h1>
  //           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
  //             A special animated celebration for your boss's birthday from the entire Moonscale team
  //           </p>
  //         </div>
  //         <Button
  //           onClick={startStory}
  //           size="lg"
  //           className="bg-gradient-party text-primary-foreground hover:shadow-glow transition-all duration-300 text-lg px-8 py-4"
  //         >
  //           <Play className="mr-2 h-5 w-5" />
  //           Start the Celebration
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Fireworks and Balloons for celebration scenes */}
      {currentScene >= 4 && currentScene <= 5 && (
        <>
          <FireworksCanvas />
          <BalloonsAnimation />
        </>
      )}

      {/* Scene Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Scene 0: Knock Knock */}
        {currentScene === 0 && (
          <div className="text-center space-y-12">
            <div className="relative">
              <img
                src={doorKnockImage}
                alt="Door knocking"
                className="w-64 h-64 mx-auto rounded-2xl shadow-card"
              />

              {/* Knock sound effects */}
              <div className="absolute inset-0 flex items-center justify-center">
                {knocksShown >= 1 && (
                  <img
                    src="/knock.png"
                    alt="knock 1"
                    className="absolute -top-8 -left-12 w-16 h-16 object-contain animate-knock-zoom"
                  />
                )}
                {knocksShown >= 2 && (
                  <img
                    src="/knock.png"
                    alt="knock 2"
                    className="absolute -top-12 right-4 w-16 h-16 object-contain animate-knock-shake"
                  />
                )}
                {knocksShown >= 3 && (
                  <img
                    src="/knock.png"
                    alt="knock 3"
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 object-contain animate-knock-spin"
                  />
                )}
              </div>
            </div>

            {knocksShown === 3 && (
              <div className="animate-text-reveal">
                <h2 className="text-4xl font-bold text-foreground">
                  Someone's knocking... 🚪
                </h2>
              </div>
            )}
          </div>
        )}

        {/* Scene 1: Today's Date */}
        {currentScene === 1 && (
          <div className="text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-500">
              <TypingText
                text={`C'est le ${getTodayDate()}`}
                speed={80}
                onComplete={() => setTextComplete(true)}
              />
            </h2>
          </div>
        )}

        {/* Scene 2: What's Special Today */}
        {currentScene === 2 && (
          <div className="text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-500">
              <TypingText
                text="Qu'est-ce qu'il y a de spécial aujourd'hui ?"
                speed={80}
                onComplete={() => setTextComplete(true)}
              />
            </h2>
          </div>
        )}

        {/* Scene 3: Name Revelation */}
        {currentScene === 3 && (
          <RandomCharacterReveal
            text="ARISTIDE"
            finalText="C'est l'anniversaire d'Aristide !"
            onComplete={() => setCurrentScene(4)}
            duration={5000}
          />
        )}

        {/* Scene 4: Fireworks Celebration */}
        {currentScene === 4 && (
          <div className="text-center space-y-8 relative z-20">
            <div className="animate-scale-in">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold bg-blue-500 bg-clip-text text-transparent mb-8 text-center">
                🎉 C'est l'anniversaire d'Aristide !! 🎉
              </h2>
            </div>
          </div>
        )}

        {/* Scene 5: Team Message */}
        {currentScene === 5 && (
          <div className="text-center space-y-8 relative z-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-blue-500 bg-clip-text text-transparent">
              <TypingText
                text="L'équipe Moonscale te souhaite un joyeux anniversaire !"
                speed={60}
                onComplete={() => setTextComplete(true)}
              />
            </h2>
          </div>
        )}

        {/* Scene 6: Celebrant Photo */}
        {currentScene === 6 && (
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="relative animate-scale-in">
              {/* <SliceAnimation src="/your-image.jpg" sliceX={8} sliceY={8} delay={1500} /> */}
              <FlashyImage src="/img.jpg" width="400px" height="400px" />
              <div className="absolute -top-4 -right-4 text-6xl animate-bounce">
                🎂
              </div>
              <div
                className="absolute -bottom-4 -left-4 text-6xl animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                🎈
              </div>
            </div>

            <h3 className="text-4xl font-bold bg-blue-500 bg-clip-text text-transparent">
              Happy Birthday, Aristide !
            </h3>

            <Button
              onClick={() => setCurrentScene(7)}
              size="lg"
              className="bg-blue-500 text-primary-foreground hover:bg-blue-600 text-xl px-8 py-4"
            >
              Voir les souhaits 💌
            </Button>
          </div>
        )}

        {/* Scene 7: Team Wishes Carousel */}
        {currentScene === 7 && (
          <div className="text-center space-y-8 max-w-4xl">
            <div className="animate-text-reveal">
              <h2 className="text-5xl font-bold bg-blue-500 bg-clip-text text-transparent mb-4">
                The whole Moonscale team wishes you a Happy Birthday!
              </h2>
            </div>

            {/* Team Member Cards */}
            <div className="relative">
              <Card className="p-8 bg-card shadow-card animate-card-slide-in max-w-lg mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {teamMembers[currentCardIndex].name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {teamMembers[currentCardIndex].name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {teamMembers[currentCardIndex].role}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-card-foreground leading-relaxed">
                    {teamMembers[currentCardIndex].message}
                  </p>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={prevCard}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-primary-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-muted-foreground">
                  {currentCardIndex + 1} of {teamMembers.length}
                </span>

                <Button
                  onClick={nextCard}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-primary-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls - Only show for fireworks scene and carousel */}
        {(currentScene === 4 || currentScene === 7) && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
            {currentScene === 4 && (
              <Button
                onClick={() => setCurrentScene(5)}
                className="bg-blue-500 text-primary-foreground hover:bg-blue-600 text-lg px-6 py-3"
              >
                Continuer
              </Button>
            )}
            <Button
              onClick={startStory}
              variant="outline"
              className="border-muted text-muted-foreground hover:bg-muted"
            >
              Recommencer
            </Button>
          </div>
        )}

        {/* Scene Indicator */}
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((scene) => (
            <div
              key={scene}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                scene === currentScene
                  ? "bg-blue-500 shadow-glow"
                  : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthdayStory;
