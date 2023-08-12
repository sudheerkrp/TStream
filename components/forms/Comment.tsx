"use client"
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/stream";
import { addCommentToStream } from "@/lib/actions/stream.actions";
import Image from "next/image";

interface Props {
    streamId: string;
    currentUserImg: string;
    currentUserId: string;
};

const Comment = ({ streamId, currentUserImg, currentUserId }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            stream: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToStream(streamId, values.stream, JSON.parse(currentUserId), pathname);
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">
                <FormField
                    control={form.control}
                    name="stream"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel>
                                <Image src={currentUserImg} alt="Profile Photo" width={48} height={48} className="rounded-full object-cover" />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input type="text" placeholder="Comment..." className="no-focus text-light-1 outline-none" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">Reply</Button>
            </form>
        </Form>
    );
}

export default Comment;