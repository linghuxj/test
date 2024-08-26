"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, requestURL } from "@/lib/fetcher";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

const Article = ({ params }: { params: { id: number } }) => {
  const { data, error, isLoading } = useSWR(
    requestURL.article + `?filter=%7B%22id%22%3A${params.id}%7D`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-8 p-8">
        <Skeleton className="h-12 w-96" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center p-8 gap-4">
      <h1 className="text-2xl font-blod">{data.data.title}</h1>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        <Link href={data.data.url} target="_blank">
          点击查看原文
        </Link>
      </blockquote>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {data.data.content}
      </p>
    </div>
  );
};

export default Article;
