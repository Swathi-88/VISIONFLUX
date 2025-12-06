import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Create = () => {
    const [ngrokUrl, setNgrokUrl] = useState("");
    const [prompt, setPrompt] = useState("");
    const [activeTab, setActiveTab] = useState("connection");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [resultFormat, setResultFormat] = useState<string>("png");
    const { toast } = useToast();

    useEffect(() => {
        const savedUrl = localStorage.getItem("ngrok_url");
        if (savedUrl) {
            setNgrokUrl(savedUrl);
            setActiveTab("create");
        }
    }, []);

    const handleSaveNgrok = () => {
        if (!ngrokUrl) {
            toast({
                title: "Error",
                description: "Please enter a valid Ngrok URL",
                variant: "destructive",
            });
            return;
        }
        localStorage.setItem("ngrok_url", ngrokUrl);
        toast({
            title: "Success",
            description: "Ngrok URL saved successfully",
        });
        setActiveTab("create");
    };

    const handleCreate = async () => {
        if (!prompt) return;

        const savedUrl = localStorage.getItem("ngrok_url");
        if (!savedUrl) {
            toast({
                title: "Error",
                description: "Please save your Ngrok URL first",
                variant: "destructive",
            });
            setActiveTab("connection");
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            // Remove trailing slash from URL to prevent double slashes
            const cleanUrl = savedUrl.replace(/\/$/, '');
            console.log("Sending prompt to Colab:", prompt);
            console.log("Ngrok URL:", cleanUrl);

            const response = await fetch(`${cleanUrl}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                    num_inference_steps: 12,
                    num_frames: 8,
                    use_interpolation: true
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "success" && data.image_base64) {
                // Detect format from response
                const format = data.format || "png";
                setResultFormat(format);
                setGeneratedImage(`data:image/${format};base64,${data.image_base64}`);
                toast({
                    title: "Success!",
                    description: `${format.toUpperCase()} generated successfully`,
                });
            } else {
                throw new Error("Invalid response from server");
            }

        } catch (error) {
            console.error("Generation error:", error);
            toast({
                title: "Generation Failed",
                description: error instanceof Error ? error.message : "Failed to connect to Colab server",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video with Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/hero-background.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl px-4 animate-fade-in">
                <Card className="bg-black/40 border-white/10 backdrop-blur-md text-white">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold font-orbitron tracking-wider shine">
                            VisionFlux Studio
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Configure your connection and start creating
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-white/10">
                                <TabsTrigger
                                    value="connection"
                                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                                >
                                    Connection
                                </TabsTrigger>
                                <TabsTrigger
                                    value="create"
                                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                                >
                                    Create
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="connection" className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200">
                                        Ngrok URL
                                    </label>
                                    <Input
                                        placeholder="https://xxxx-xx-xx-xx-xx.ngrok-free.app"
                                        value={ngrokUrl}
                                        onChange={(e) => setNgrokUrl(e.target.value)}
                                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                                    />
                                    <p className="text-xs text-gray-400">
                                        Enter the public URL from your Colab instance
                                    </p>
                                </div>
                                <Button
                                    onClick={handleSaveNgrok}
                                    className="w-full btn-visionflux bg-white hover:bg-black"
                                >
                                    <span className="text-white">Save Connection</span>
                                </Button>
                            </TabsContent>

                            <TabsContent value="create" className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200">
                                        Your Prompt
                                    </label>
                                    <Textarea
                                        placeholder="Describe the video you want to generate..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="min-h-[150px] bg-black/50 border-white/10 text-white placeholder:text-gray-500 resize-none"
                                    />
                                </div>
                                <Button
                                    onClick={handleCreate}
                                    disabled={!prompt || isGenerating}
                                    className="w-full btn-visionflux bg-white hover:bg-black disabled:opacity-50"
                                >
                                    <span className="text-white">
                                        {isGenerating ? "Generating..." : "Generate Video"}
                                    </span>
                                </Button>

                                {/* Generated Image/Video Display */}
                                {generatedImage && (
                                    <div className="mt-6 space-y-2">
                                        <label className="text-sm font-medium text-gray-200">
                                            Generated Result
                                        </label>
                                        <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                            <img
                                                src={generatedImage}
                                                alt="Generated result"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = generatedImage;
                                                link.download = resultFormat === 'gif' ? 'visionflux-video.gif' : 'visionflux-image.png';
                                                link.click();
                                            }}
                                            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                        >
                                            Download {resultFormat === 'gif' ? 'Video' : 'Image'}
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Create;
