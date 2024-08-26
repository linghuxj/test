"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetcher, requestURL } from "@/lib/fetcher";
import useSWR, { useSWRConfig } from "swr";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Article } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { url } from "inspector";
import { Skeleton } from "@/components/ui/skeleton";

const FormSchema = z.object({
  url: z
    .string()
    .startsWith("http", {
      message: "请输入以http开头的链接地址",
    })
    .url({
      message: "请输入有效的URL地址",
    }),
});

export default function Home() {
  const router = useRouter();

  const [submitLoading, setSubmitLoading] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    requestURL.articles + "?filter=%7B%7D",
    fetcher
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  });

  const create = async (data: string) => {
    try {
      const resp = await fetch(requestURL.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer app-oUS0QYkC8X7aXSJVYNARZYQT",
        },
        body: JSON.stringify({
          inputs: { URL: data },
          response_mode: "blocking",
          user: "abc-123",
        }),
      });
      if (!resp.ok) {
        toast({
          title: "URL地址数据获取异常",
          description: `地址：${data} 的内容无法正常获取，请稍后重试。`,
        });
      }
      await resp.json();
      form.reset();
      mutate();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitLoading(true);
    create(data.url);
  }

  return (
    <main className="flex flex-col items-center p-8 gap-8">
      <div className="flex w-full max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-row space-x-4 w-full"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="请输入需要添加内容的链接地址"
                      {...field}
                      disabled={submitLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitLoading}>
              <Loader2
                className={`mr-2 h-4 w-4 animate-spin ${
                  !submitLoading ? "hidden" : "block"
                }`}
              />
              {!submitLoading ? "新增" : "耐心等待"}
            </Button>
          </form>
        </Form>
      </div>
      {!data && isLoading ? (
        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <Skeleton className="h-[128px] w-auto rounded-xl" />
          <Skeleton className="h-[128px] w-auto rounded-xl" />
        </div>
      ) : !data || !data.data || data.data.length <= 0 ? (
        <div>暂无内容</div>
      ) : (
        <>
          <div className="items-center font-bold text-3xl">文档列表</div>
          <div className="flex-1 grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-2">
            {data.data.map((article: Article) => (
              <Card
                className="w-auto h-auto dark:hover:bg-slate-900 hover:bg-slate-100 hover:cursor-pointer"
                key={article.id}
                onClick={() => router.push(`/article/${article.id}`)}
              >
                <CardHeader>
                  <p className="font-bold text-xl">{article.title} →</p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 overflow-hidden text-ellipsis">
                    {article.content}
                  </p>
                </CardContent>
                {article.tags.length > 1 ? (
                  <CardFooter>
                    <div className="flex items-center gap-2">
                      {article.tags.split(",").map((tag: string) => (
                        <Badge variant="secondary" key={tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                ) : null}
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
