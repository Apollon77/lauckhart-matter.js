import { Cluster, Attributes, Commands, Events } from "./Cluster.js";

/**
 * Instances of this class tie together the public interface types and the
 * definition for a specific cluster.  They are generated in the cluster
 * interface file and consumed in standard device implementations.
 */
export type ClusterInterface<ST /* state */, CL /* client */, SVR /* server */> = {
    definition: Cluster<any, any, Attributes, Commands, Events>;

    // Avoid unused type parameter warnings
    _used?: never & ST & CL & SVR;
};
