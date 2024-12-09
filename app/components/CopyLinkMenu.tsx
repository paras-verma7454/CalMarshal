"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

export  function CopyLinkMenuItem({meetingUrl}: {meetingUrl: string}){

    const handleCopy =  async ()=>{
        try{
            await navigator.clipboard.writeText(meetingUrl);
            toast.success("URL Copied to clipboard");
        }
        catch(err){
            toast.error("Could not copy URL to clipboard");
        }
    }

    return(
        <DropdownMenuItem onSelect={handleCopy}>
            <Link2 className=" size-4"/>
            Copy
        </DropdownMenuItem>
    )
}