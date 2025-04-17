"use client";

import { Form, FormField, FormControl } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  message: z.string(),
});

const MessageForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="p-4 bg-white absolute bottom-0 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormControl>
                <Input placeholder="Send a message" {...field} />
              </FormControl>
            )}
          />
          <Button type="submit" className="ml-2" variant={"tertiary"}>
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MessageForm;
