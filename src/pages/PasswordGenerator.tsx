import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, RefreshCw, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PasswordGenerator = () => {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [strength, setStrength] = useState<"weak" | "medium" | "strong">("medium");

    const generatePassword = () => {
        let charset = "";
        if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
        if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) charset += "0123456789";
        if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

        if (charset === "") {
            setPassword("");
            return;
        }

        let newPassword = "";
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
        calculateStrength(newPassword);
    };

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (pass.length > 8) score++;
        if (pass.length > 12) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score < 3) setStrength("weak");
        else if (score < 5) setStrength("medium");
        else setStrength("strong");
    };

    const copyToClipboard = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        toast.success("Password copied to clipboard!");
    };

    useEffect(() => {
        generatePassword();
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    const getStrengthColor = () => {
        switch (strength) {
            case "weak": return "text-red-500";
            case "medium": return "text-yellow-500";
            case "strong": return "text-green-500";
            default: return "text-gray-500";
        }
    };

    const getStrengthIcon = () => {
        switch (strength) {
            case "weak": return <ShieldAlert className="w-6 h-6 text-red-500" />;
            case "medium": return <Shield className="w-6 h-6 text-yellow-500" />;
            case "strong": return <ShieldCheck className="w-6 h-6 text-green-500" />;
            default: return <Shield className="w-6 h-6 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tools
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Password Generator
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Create strong, secure passwords instantly
                        </p>
                    </div>

                    <Card className="p-6 space-y-6">
                        <div className="relative">
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                                <span className="text-xl font-mono break-all mr-4 text-gray-800 dark:text-gray-200">
                                    {password || "Select options to generate"}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={generatePassword}
                                        title="Regenerate"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={copyToClipboard}
                                        title="Copy"
                                        disabled={!password}
                                    >
                                        <Copy className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                            {password && (
                                <div className="absolute -top-3 right-4 bg-white dark:bg-gray-900 px-2 text-xs font-medium flex items-center gap-1 shadow-sm rounded-full border">
                                    {getStrengthIcon()}
                                    <span className={`uppercase ${getStrengthColor()}`}>
                                        {strength}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Password Length: {length}</label>
                                </div>
                                <Slider
                                    value={[length]}
                                    onValueChange={(value) => setLength(value[0])}
                                    min={4}
                                    max={64}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="text-sm">Uppercase (A-Z)</span>
                                    <Switch
                                        checked={includeUppercase}
                                        onCheckedChange={(checked) => {
                                            if (!checked && !includeLowercase && !includeNumbers && !includeSymbols) return;
                                            setIncludeUppercase(checked);
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="text-sm">Lowercase (a-z)</span>
                                    <Switch
                                        checked={includeLowercase}
                                        onCheckedChange={(checked) => {
                                            if (!checked && !includeUppercase && !includeNumbers && !includeSymbols) return;
                                            setIncludeLowercase(checked);
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="text-sm">Numbers (0-9)</span>
                                    <Switch
                                        checked={includeNumbers}
                                        onCheckedChange={(checked) => {
                                            if (!checked && !includeUppercase && !includeLowercase && !includeSymbols) return;
                                            setIncludeNumbers(checked);
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="text-sm">Symbols (!@#$)</span>
                                    <Switch
                                        checked={includeSymbols}
                                        onCheckedChange={(checked) => {
                                            if (!checked && !includeUppercase && !includeLowercase && !includeNumbers) return;
                                            setIncludeSymbols(checked);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PasswordGenerator;
