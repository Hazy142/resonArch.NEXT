import { z } from "zod";

export const audienceSchema = z.enum(["software", "engineering", "creator", "exploring"]);

export const votePayloadSchema = z.object({
  serviceIds: z.array(z.string().min(1)).min(1).max(3).refine(
    (ids) => new Set(ids).size === ids.length,
    "Each service can only appear once in a ballot."
  ),
  audience: audienceSchema,
  interestType: z.enum(["use-myself", "team", "integrate-api", "curious"]),
  useCase: z.string().max(500).optional().default(""),
  betaInterest: z.boolean().optional().default(false),
  paymentInterest: z.boolean().optional().default(false)
});

export type VotePayload = z.infer<typeof votePayloadSchema>;
